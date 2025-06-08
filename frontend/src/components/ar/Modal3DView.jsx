import React, {
  useState,
  useRef,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import "../../assets/styles/components/modal/Modal3DView.scss";
import { trackARSessionEnd } from "../../utils/analytics";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Simplified Loader component
function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="loader">
        <div className="loader-progress">{progress.toFixed(0)}%</div>
        <div className="loader-bar">
          <div
            className="loader-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Html>
  );
}

// Model component with optimized material handling and memory management
function Model({ url, colorConfig }) {
  const { scene, materials, animations, ...gltf } = useGLTF(url);
  const { camera } = useThree();
  const originalMaterials = useRef(new Map());

  // Clean up function for materials
  const cleanupMaterials = useCallback(() => {
    originalMaterials.current.forEach((material) => {
      if (material.map) material.map.dispose();
      if (material.normalMap) material.normalMap.dispose();
      if (material.roughnessMap) material.roughnessMap.dispose();
      if (material.metalnessMap) material.metalnessMap.dispose();
      if (material.aoMap) material.aoMap.dispose();
      if (material.emissiveMap) material.emissiveMap.dispose();
      material.dispose();
    });
    originalMaterials.current.clear();
  }, []);

  useEffect(() => {
    if (!scene) return;

    console.log("Color config:", colorConfig);

    // Clone scene to avoid modifying the original
    const clonedScene = scene.clone();

    clonedScene.traverse((node) => {
      if (!node.material) return;

      const partName = node.name;
      const config = colorConfig?.[partName];

      // Store original materials for cleanup
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach((mat, index) => {
        const key = `${node.uuid}_${index}`;
        if (!originalMaterials.current.has(key)) {
          originalMaterials.current.set(key, mat.clone());
        }
      });

      // Apply color configuration
      if (config && node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        materials.forEach((mat) => {
          if (mat.color) {
            try {
              mat.color.set(config.color);
              mat.needsUpdate = true;
            } catch (error) {
              console.warn("Failed to set color:", error);
            }
          }
        });
      }

      // Handle mirror materials
      materials.forEach((mat) => {
        if (mat.name && mat.name.toLowerCase().includes("mirror")) {
          mat.transparent = true;
          mat.opacity = 0.2;
          mat.needsUpdate = true;
        }
      });
    });

    // Calculate bounding box for normalization
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model
    clonedScene.position.x = -center.x;
    clonedScene.position.y = -center.y;
    clonedScene.position.z = -center.z;

    // Normalize scale
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    clonedScene.scale.set(scale, scale, scale);

    // Set camera position
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Cleanup function
    return () => {
      cleanupMaterials();
      // Dispose cloned scene
      clonedScene.traverse((node) => {
        if (node.geometry) {
          node.geometry.dispose();
        }
        if (node.material) {
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
          materials.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            if (mat.normalMap) mat.normalMap.dispose();
            if (mat.roughnessMap) mat.roughnessMap.dispose();
            if (mat.metalnessMap) mat.metalnessMap.dispose();
            if (mat.aoMap) mat.aoMap.dispose();
            if (mat.emissiveMap) mat.emissiveMap.dispose();
            mat.dispose();
          });
        }
      });
    };
  }, [scene, camera, colorConfig, cleanupMaterials]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMaterials();
    };
  }, [cleanupMaterials]);

  return (
    <primitive object={scene} scale={1} position={[0, 0, 0]} dispose={null} />
  );
}

// Notification component
function Notification({ status, message }) {
  return (
    <div className={`saved-notification ${status === "error" ? "error" : ""}`}>
      <span className="check-icon">
        {status === "success" ? "✓" : status === "error" ? "❌" : ""}
      </span>
      {message}
    </div>
  );
}

// Main modal component
function Modal3DView({
  isOpen,
  onClose,
  modelUrl = "/models/xanh_lam_2D4A82FF.glb",
  colorConfig,
}) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const [showThumbnail, setShowThumbnail] = useState(false);
  const canvasRef = useRef(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const timeoutRefs = useRef([]);

  // Clear all timeouts helper
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  // Safe setTimeout that tracks timeout IDs
  const safeSetTimeout = useCallback((callback, delay) => {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove completed timeout from tracking
      timeoutRefs.current = timeoutRefs.current.filter(
        (id) => id !== timeoutId
      );
    }, delay);
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    setSessionStart(Date.now());
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [clearAllTimeouts, thumbnailUrl]);

  const handleClose = useCallback(() => {
    if (sessionStart) {
      const duration = parseFloat(
        ((Date.now() - sessionStart) / 1000).toFixed(2)
      );
      trackARSessionEnd(duration);
    }
    clearAllTimeouts();
    onClose();
  }, [sessionStart, clearAllTimeouts, onClose]);

  // Capture canvas and copy to clipboard
  const captureCanvasAndCopy = useCallback(async () => {
    if (!canvasRef.current) return;
    setCopyStatus("copying");

    try {
      const canvas = canvasRef.current.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");

      // Wait for next frame to ensure content is rendered
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const thumbnailCanvas = document.createElement("canvas");
      const ctx = thumbnailCanvas.getContext("2d");

      thumbnailCanvas.width = 300;
      thumbnailCanvas.height = 200;

      // Fill white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      // Draw the 3D canvas content
      ctx.drawImage(
        canvas,
        5,
        5,
        thumbnailCanvas.width - 10,
        thumbnailCanvas.height - 10
      );

      const dataUrl = thumbnailCanvas.toDataURL("image/png", 0.9);

      // Clean up old thumbnail URL
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }

      setThumbnailUrl(dataUrl);
      setShowThumbnail(true);

      const blob = await new Promise((resolve) =>
        thumbnailCanvas.toBlob(resolve, "image/png", 0.9)
      );

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopyStatus("success");

        safeSetTimeout(() => setCopyStatus("idle"), 2000);
        safeSetTimeout(() => setShowThumbnail(false), 4000);
      } else {
        throw new Error("Clipboard API not supported");
      }

      // Clean up canvas
      thumbnailCanvas.width = 0;
      thumbnailCanvas.height = 0;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setCopyStatus("error");
      safeSetTimeout(() => setCopyStatus("idle"), 2000);
      safeSetTimeout(() => setShowThumbnail(false), 4000);
    }
  }, [thumbnailUrl, safeSetTimeout]);

  if (!isOpen) return null;

  return (
    <div className="model-viewer-modal" onClick={(e) => e.stopPropagation()}>
      <div className="model-viewer-content">
        {/* Save View Button */}
        <button
          className="save-view-button"
          onClick={(e) => {
            e.stopPropagation();
            captureCanvasAndCopy();
          }}
          disabled={copyStatus === "copying"}
          aria-label="Save view"
        >
          <span className="save-icon">
            {copyStatus === "copying" ? "⏳" : "📷"}
          </span>
          {copyStatus === "copying" ? "COPYING..." : "SAVE VIEW"}
        </button>

        {/* Notification */}
        {copyStatus !== "idle" && (
          <Notification
            status={copyStatus}
            message={
              copyStatus === "success"
                ? "SAVED TO CLIPBOARD"
                : copyStatus === "error"
                ? "COPY FAILED"
                : ""
            }
          />
        )}

        {/* Thumbnail Preview */}
        {showThumbnail && thumbnailUrl && (
          <div className="thumbnail-container">
            <img
              className="thumbnail-preview"
              alt="Saved view"
              src={thumbnailUrl}
            />
          </div>
        )}

        {/* Close button */}
        <button
          className="modal-close-button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* 3D Canvas */}
        <div className="canvas-container" ref={canvasRef}>
          <Canvas
            camera={{ position: [0, 0, 3], fov: 45 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            shadows
            onCreated={({ gl }) => {
              // Optimize renderer settings
              gl.physicallyCorrectLights = true;
              gl.outputEncoding = THREE.sRGBEncoding;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.0;
            }}
          >
            <color attach="background" args={["#e6e6e6"]} />

            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.8} />
              <spotLight
                position={[5, 5, 5]}
                angle={0.25}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />

              <Model url={modelUrl} colorConfig={colorConfig || {}} />

              {/* Only load environment if file exists */}
              <Environment
                files="/hdr/studio_small_03_1k.hdr"
                background={false}
                onError={(error) => {
                  console.warn("Environment texture failed to load:", error);
                }}
              />
            </Suspense>

            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={6}
              blur={2}
              far={3}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              enableDamping={true}
              maxDistance={10}
              minDistance={1}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// Preload the GLTF model to avoid loading issues
useGLTF.preload = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, resolve, undefined, (error) => {
      console.error("Failed to preload GLTF:", error);
      reject(error);
    });
  });
};

export default Modal3DView;

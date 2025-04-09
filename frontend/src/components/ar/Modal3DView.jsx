import React, { useState, useRef, Suspense, useEffect } from "react";
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

// Model component with optimized material handling and camera adjustment
function Model({ url, colorConfig }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();

  useEffect(() => {
    console.log(colorConfig);
    scene.traverse((node) => {
      if (!node.material) return;

      const partName = node.name;
      const config = colorConfig?.[partName];

      console.log(config);

      if (config && node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        materials.forEach((mat) => {
          if (mat.color) {
            mat.color.set(config.color);
            mat.needsUpdate = true;
          }
        });
      }

      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach((mat) => {
        if (mat.name.toLowerCase().includes("mirror")) {
          mat.transparent = true;
          mat.opacity = 0.2;
        }
      });
    });

    // Auto-adjust camera to fit model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.3;

    camera.position.set(0, 0, cameraZ);
    camera.lookAt(center);
  }, [scene, camera]);

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
  modelUrl = "/path/to/glasses.glb",
  colorConfig,
}) {
  const [copyStatus, setCopyStatus] = useState("idle"); // idle, copying, success, error
  const [showThumbnail, setShowThumbnail] = useState(false);
  const canvasRef = useRef(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Capture canvas and copy to clipboard
  const captureCanvasAndCopy = async () => {
    if (!canvasRef.current) return;
    setCopyStatus("copying");

    try {
      const canvas = canvasRef.current.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");

      // Đợi 1 frame trước khi chụp ảnh để đảm bảo nội dung đã render xong
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const thumbnailCanvas = document.createElement("canvas");
      const ctx = thumbnailCanvas.getContext("2d");

      thumbnailCanvas.width = 300;
      thumbnailCanvas.height = 200;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
      ctx.drawImage(
        canvas,
        5,
        5,
        thumbnailCanvas.width - 10,
        thumbnailCanvas.height - 10
      );

      const dataUrl = thumbnailCanvas.toDataURL("image/png");
      setThumbnailUrl(dataUrl);
      setShowThumbnail(true);

      const blob = await new Promise((resolve) =>
        thumbnailCanvas.toBlob(resolve, "image/png")
      );

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopyStatus("success");
        setShowThumbnail(true);
        onSaveView();
        setTimeout(() => setCopyStatus("idle"), 2000);
        setTimeout(() => setShowThumbnail(false), 4000);
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
      setTimeout(() => setShowThumbnail(false), 4000);
    }
  };

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
        {showThumbnail && (
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
            onClose();
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
            }}
            shadows
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
              />

              <Model url={modelUrl} colorConfig={colorConfig || {}} />
              <Environment files="/hdr/studio_small_03_1k.hdr" />
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
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

export default Modal3DView;

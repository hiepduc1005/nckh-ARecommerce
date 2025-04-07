import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Stage,
  useHelper,
  useProgress,
  Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import LoadingScreen from "../components/ar/LoadingScreen";
import ModelCustomize from "../components/ar/ModelCustomize";
import { saveAs } from "file-saver";
import ColorControls from "../components/ar/ColorControls";

function ScreenshotHelper({ cameraRef }) {
  const { gl, scene } = useThree();

  const captureScreenshot = async () => {
    const angles = [
      { name: "front", pos: [0, 0, 0.2] },
      { name: "left", pos: [-0.2, 0, 0] },
      { name: "right", pos: [0.2, 0, 0] },
    ];

    for (const angle of angles) {
      cameraRef.current.position.set(...angle.pos);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();

      // Force render
      gl.render(scene, cameraRef.current);

      const dataUrl = gl.domElement.toDataURL("image/png");
      // saveAs(dataUrl, `shoe-${angle.name}.png`);

      await new Promise((res) => setTimeout(res, 200)); // Optional delay
    }
  };

  // Gắn hàm vào window để có thể gọi từ bên ngoài (hoặc props tùy bạn)
  useEffect(() => {
    window.captureScreenshot = captureScreenshot;
  }, []);

  return null;
}
// Enhanced controls component with orbit controls manager
function SceneControls({ isDragging }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  // Parameters for smooth and limited control
  const dampingFactor = 0.15; // Higher value = smoother but slower damping (0-1)
  const rotateSpeed = 0.5; // Lower value = slower rotation
  const zoomSpeed = 0.8; // Lower value = slower zoom
  const panSpeed = 0.8; // Lower value = slower panning

  // Zoom distance limits
  const minDistance = 0; // Minimum zoom distance (closest to model)
  const maxDistance = 1; // Maximum zoom distance (furthest from model)

  // Initialize controls with enhanced parameters
  useEffect(() => {
    if (controlsRef.current) {
      // Enable damping for smoother control
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = dampingFactor;

      // Set rotation speed
      controlsRef.current.rotateSpeed = rotateSpeed;

      // Set zoom speed and limits
      controlsRef.current.zoomSpeed = zoomSpeed;
      controlsRef.current.minDistance = minDistance;
      controlsRef.current.maxDistance = maxDistance;

      // Set pan speed
      controlsRef.current.panSpeed = panSpeed;

      // Optional: Limit vertical rotation if needed
      // controlsRef.current.minPolarAngle = Math.PI / 6; // 30 degrees from top
      // controlsRef.current.maxPolarAngle = Math.PI * 5/6; // 150 degrees from top
    }
  }, []);

  // Disable orbit controls when dragging model parts
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDragging;
    }
  }, [isDragging]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      makeDefault
    />
  );
}

// Scene component that wraps everything in the 3D scene
function Scene({ modelUrl, onSelectPart, isDragging, setIsDragging }) {
  return (
    <Suspense fallback={null}>
      <Stage environment="city" intensity={0.5}>
        <ModelCustomize
          url={modelUrl}
          onSelectPart={onSelectPart}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </Stage>
      <SceneControls isDragging={isDragging} />
    </Suspense>
  );
}

// Main component
export default function Interactive3DViewer({
  modelUrl = "/models/tim_nhat_837479.glb",
}) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalMaterials, setOriginalMaterials] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [parts, setParts] = useState([]);
  const [originalParts, setOriginalParts] = useState([]);

  // Listen to loading progress
  const { progress, errors } = useProgress();

  const canvasRef = useRef();
  const cameraRef = useRef();

  // Set the loaded state when progress reaches 100%
  useEffect(() => {
    if (progress === 100) {
      // Add a small delay to ensure everything is rendered properly
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleSelectPart = (part) => {
    setSelectedPart(part);

    // Store the original material of the selected part
    if (part && !originalMaterials[part.uuid]) {
      if (Array.isArray(part.material)) {
        setOriginalMaterials((prev) => ({
          ...prev,
          [part.uuid]: part.material.map((mat) => mat.clone()),
        }));
      } else {
        setOriginalMaterials((prev) => ({
          ...prev,
          [part.uuid]: part.material.clone(),
        }));
      }
    }
  };

  const handleColorChange = (color) => {
    if (!selectedPart) return;

    // If reset was clicked, restore original material
    if (color === "reset") {
      console.log(originalMaterials);
      if (originalMaterials[selectedPart.uuid]) {
        const originalMaterial = originalMaterials[selectedPart.uuid];

        setSelectedPart((prevPart) => {
          let updatedPart = { ...prevPart };
          if (Array.isArray(updatedPart.material)) {
            updatedPart.material = originalMaterial.map((mat) => mat.clone());
          } else {
            updatedPart.material = originalMaterial.clone();
          }
          return updatedPart;
        });
      }
      return;
    }

    // Handle different material types
    setSelectedPart((prevPart) => {
      let updatedPart = { ...prevPart };

      if (Array.isArray(updatedPart.material)) {
        updatedPart.material.forEach((mat) => {
          applyColorToMaterial(mat, color);
        });
      } else {
        applyColorToMaterial(updatedPart.material, color);
      }

      // Trả về đối tượng part đã cập nhật màu sắc
      return updatedPart;
    });

    // Log for debugging
    console.log(`Changed color of ${selectedPart.name} to ${color}`);
  };

  // Helper function to apply color to different material types
  const applyColorToMaterial = (material, colorHex) => {
    const color = new THREE.Color(colorHex);

    // Handle different material types
    if (
      material.type === "MeshStandardMaterial" ||
      material.type === "MeshPhysicalMaterial" ||
      material.type === "MeshLambertMaterial"
    ) {
      material.color.set(color);
    }

    // For glass/mirror materials, try different approaches
    if (
      (material.name && material.name.toLowerCase().includes("mirror")) ||
      (material.name && material.name.toLowerCase().includes("glass"))
    ) {
      material.color.set(color);
      material.emissive.set(color);
      material.emissiveIntensity = 0.5;

      // Adjust transparency for glass
      if (material.name.toLowerCase().includes("mirror")) {
        material.transparent = true;
        material.opacity = 0.2;
      }
    }

    // For reflective materials, update reflection properties
    if (material.metalness !== undefined) {
      material.metalness = 0.8;
      material.roughness = 0.2;
    }

    // For special shader materials
    if (
      material.type === "ShaderMaterial" ||
      material.type === "RawShaderMaterial"
    ) {
      if (material.uniforms.color) {
        material.uniforms.color.value.set(color);
      }
    }

    // Ensure material update flag is set
    material.needsUpdate = true;
  };

  // Preload the model
  useEffect(() => {
    useGLTF.preload(modelUrl);
  }, [modelUrl]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#f7f7f7",
      }}
    >
      {!isLoaded && <LoadingScreen />}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        onPointerMissed={() => setSelectedPart(null)}
        gl={{
          antialias: true, // Enable antialiasing for smoother rendering
          powerPreference: "high-performance", // Request high performance GPU
        }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
        dpr={[1, 2]} // Responsive DPR for better performance on different devices
        style={{ visibility: isLoaded ? "visible" : "hidden" }}
      >
        <color attach="background" args={["#f7f7f7"]} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <ModelCustomize
              url={modelUrl}
              onSelectPart={handleSelectPart}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              setParts={setParts}
              setOriginalParts={setOriginalParts}
            />
          </Stage>
          <SceneControls isDragging={isDragging} />
        </Suspense>

        {selectedPart && (
          <EffectComposer multisampling={8} autoClear={false}>
            <Outline
              selection={[selectedPart]}
              edgeStrength={5}
              pulseSpeed={0.5}
              visibleEdgeColor="#ffffff"
              hiddenEdgeColor="#000000"
              blur
              width={500}
            />
          </EffectComposer>
        )}
        <Stats />
        <ScreenshotHelper cameraRef={cameraRef} />
      </Canvas>

      {/* Navigation bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          visibility: isLoaded ? "visible" : "hidden",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
            Custom 3D Model Viewer
          </h2>
        </div>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Done
        </button>
      </div>

      {/* Model controls panel */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          right: "20px",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "800px",
          margin: "0 auto",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      >
        <ColorControls
          selectedPart={selectedPart}
          onColorChange={handleColorChange}
          parts={parts}
          setSelectedPart={setSelectedPart}
        />
      </div>
    </div>
  );
}

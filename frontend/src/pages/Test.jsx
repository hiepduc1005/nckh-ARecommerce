import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  useProgress,
  Stats,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import LoadingScreen from "../components/ar/LoadingScreen";
import ModelCustomize from "../components/ar/ModelCustomize";
import { saveAs } from "file-saver";
import ColorControls from "../components/ar/ColorControls";
import ScreenshotHelper from "../components/helper/ScreenshotHelper";
import SceneControls from "../components/ar/SceneControls";

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

  const resetAllParts = () => {
    // Chỉ thực hiện nếu có phần tử trong parts
    if (parts.length === 0) return;

    console.log("Resetting all parts to original materials");

    // Lặp qua tất cả các phần tử trong mô hình
    parts.forEach((part) => {
      // Kiểm tra xem có material gốc cho phần tử này không
      if (
        window.originalMaterialsMap &&
        window.originalMaterialsMap[part.uuid]
      ) {
        const originalMaterial = window.originalMaterialsMap[part.uuid];

        // Áp dụng material gốc trực tiếp vào mesh
        if (Array.isArray(originalMaterial)) {
          // Cho đối tượng multi-material
          part.material = originalMaterial.map((mat) => mat.clone());
        } else {
          // Cho đối tượng single material
          part.material = originalMaterial.clone();
        }

        // Đảm bảo material được cập nhật
        if (Array.isArray(part.material)) {
          part.material.forEach((mat) => (mat.needsUpdate = true));
        } else {
          part.material.needsUpdate = true;
        }

        console.log(`Reset material for ${part.name}`);
      }
    });

    // Cập nhật state để kích hoạt re-render
    setParts([...parts]);

    // Nếu đang có phần tử được chọn, cập nhật lại nó
    if (selectedPart) {
      setSelectedPart({ ...selectedPart });
    }
  };

  const handleColorChange = (color, resetAll = false) => {
    if (resetAll) {
      resetAllParts();
      return;
    }
    if (!selectedPart) return;

    // If reset was clicked, restore original material
    if (color === "reset") {
      // Use the global material map that was stored during initialization
      if (
        window.originalMaterialsMap &&
        window.originalMaterialsMap[selectedPart.uuid]
      ) {
        const originalMaterial = window.originalMaterialsMap[selectedPart.uuid];

        // Apply original material DIRECTLY to the mesh
        if (Array.isArray(originalMaterial)) {
          // For multi-material objects
          selectedPart.material = originalMaterial.map((mat) => mat.clone());
        } else {
          // For single material objects
          selectedPart.material = originalMaterial.clone();
        }

        // Make sure material updates are applied
        selectedPart.material.needsUpdate = true;

        // Force state update to trigger a re-render
        setSelectedPart({ ...selectedPart });

        console.log("Reset material for", selectedPart.name);
      } else {
        console.warn("Original material not found for", selectedPart.uuid);
      }
      return;
    }

    // Handle different material types for color change
    if (Array.isArray(selectedPart.material)) {
      selectedPart.material.forEach((mat) => {
        applyColorToMaterial(mat, color);
      });
    } else {
      applyColorToMaterial(selectedPart.material, color);
    }

    // Force state update
    setSelectedPart({ ...selectedPart });

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
          <Stage intensity={0.5}>
            <Environment files="/hdr/studio_small_03_1k.hdr" />
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
          onColorChange={(color, resetAll = false) => {
            if (resetAll) {
              resetAllParts(); // Gọi hàm resetAllParts() đã định nghĩa ở trên
            } else {
              handleColorChange(color); // Gọi hàm xử lý màu sắc thông thường
            }
          }}
          parts={parts}
          setSelectedPart={setSelectedPart}
        />
      </div>
    </div>
  );
}

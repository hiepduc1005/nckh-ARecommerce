import React, { useRef, useEffect, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";

// Mock GLTF loader for demo purposes
const mockGLTF = (url) => {
  if (url.includes("face.glb")) {
    // Tạo geometry cho occluder - hình dạng giống mặt người
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.8, 1, 0.6); // Tạo hình oval giống mặt

    const scene = new THREE.Group();
    scene.add(mesh);
    return { scene };
  } else {
    // Tạo geometry cho kính - hình chữ nhật với hai ống kính
    const frameGeometry = new THREE.BoxGeometry(2, 0.6, 0.1);
    const lensGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);

    // Khung kính
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // Ống kính trái
    const leftLensMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const leftLens = new THREE.Mesh(lensGeometry, leftLensMaterial);
    leftLens.position.set(-0.4, 0, 0.05);
    leftLens.rotation.x = Math.PI / 2;

    // Ống kính phải
    const rightLens = new THREE.Mesh(lensGeometry, leftLensMaterial);
    rightLens.position.set(0.4, 0, 0.05);
    rightLens.rotation.x = Math.PI / 2;

    // Cầu nối giữa hai ống kính
    const bridgeGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
    const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
    bridge.position.set(0, 0.1, 0);

    const scene = new THREE.Group();
    scene.add(frame);
    scene.add(leftLens);
    scene.add(rightLens);
    scene.add(bridge);

    const materials = {
      "glasses_mirror.001": leftLensMaterial,
    };

    return { scene, materials };
  }
};

// Component FaceOccluder đã cải thiện
const FaceOccluder = memo(({ positions, isDebug = false }) => {
  const { scene } = mockGLTF("/models/face.glb");
  const occluderRef = useRef();

  useEffect(() => {
    if (occluderRef.current) {
      occluderRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial(
            isDebug
              ? {
                  color: 0xff0000,
                  transparent: true,
                  opacity: 0.3,
                  side: THREE.DoubleSide,
                }
              : {
                  colorWrite: false,
                  depthWrite: true,
                  side: THREE.DoubleSide,
                }
          );
          // Đảm bảo occluder render trước kính
          child.renderOrder = -1;
        }
      });
    }
  }, [isDebug]);

  useFrame(() => {
    if (!occluderRef.current || !positions.nose) return;

    const { leftEye, rightEye, nose, glassesRotation, scale } = positions;

    // Tính toán vị trí trung tâm giữa hai mắt
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2;
    const centerZ = (leftEye.z + rightEye.z) / 2;

    // Đặt occluder ở vị trí mặt, hơi lùi về phía sau
    occluderRef.current.position.set(centerX, centerY - 0.1, centerZ - 0.3);

    // Áp dụng rotation từ face tracking
    if (glassesRotation) {
      const euler = new THREE.Euler(
        glassesRotation.x,
        glassesRotation.y,
        glassesRotation.z,
        "XYZ"
      );
      occluderRef.current.rotation.copy(euler);
    }

    // Tính toán kích thước dựa trên khoảng cách giữa hai mắt
    const eyeDistance = new THREE.Vector3()
      .subVectors(leftEye, rightEye)
      .length();

    const scaleFactor = Math.max(eyeDistance * 8, 1.5); // Đảm bảo kích thước tối thiểu
    occluderRef.current.scale.set(
      scaleFactor,
      scaleFactor * 1.2,
      scaleFactor * 0.8
    );
  });

  return <primitive ref={occluderRef} object={scene} />;
});

// Component GlassesModel đã cải thiện
const GlassesModel = memo(({ positions }) => {
  const { scene, materials } = mockGLTF("/models/trang_sua_c2ceb8.glb");
  const glassesRef = useRef();

  useEffect(() => {
    if (glassesRef.current) {
      glassesRef.current.traverse((child) => {
        if (child.isMesh) {
          // Đảm bảo kính render sau occluder
          child.renderOrder = 1;
        }
      });
    }
  }, []);

  useFrame(() => {
    if (!glassesRef.current || !positions.leftEye || !positions.rightEye)
      return;

    const { leftEye, rightEye, glassesRotation } = positions;

    // Tính toán vị trí trung tâm giữa hai mắt
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2;
    const centerZ = (leftEye.z + rightEye.z) / 2;

    // Đặt kính ở vị trí mắt
    glassesRef.current.position.set(centerX, centerY, centerZ);

    // Áp dụng rotation
    if (glassesRotation) {
      const euler = new THREE.Euler(
        glassesRotation.x,
        glassesRotation.y,
        glassesRotation.z,
        "XYZ"
      );
      glassesRef.current.rotation.copy(euler);
    }

    // Tính toán kích thước dựa trên khoảng cách giữa hai mắt
    const eyeDistance = new THREE.Vector3()
      .subVectors(leftEye, rightEye)
      .length();

    const scaleFactor = Math.max(eyeDistance * 4, 0.8); // Kích thước phù hợp cho kính
    glassesRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  return <primitive ref={glassesRef} object={scene} />;
});

// Mock MediaPipe face detection
const useFaceDetection = () => {
  const [positions, setPositions] = useState({
    leftEye: new THREE.Vector3(-0.3, 0.1, 0),
    rightEye: new THREE.Vector3(0.3, 0.1, 0),
    nose: new THREE.Vector3(0, 0, 0),
    glassesRotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  });

  useEffect(() => {
    // Simulate face movement for demo
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;
      setPositions({
        leftEye: new THREE.Vector3(
          -0.3 + Math.sin(time) * 0.1,
          0.1 + Math.cos(time * 0.7) * 0.05,
          Math.sin(time * 0.5) * 0.1
        ),
        rightEye: new THREE.Vector3(
          0.3 + Math.sin(time) * 0.1,
          0.1 + Math.cos(time * 0.7) * 0.05,
          Math.sin(time * 0.5) * 0.1
        ),
        nose: new THREE.Vector3(
          Math.sin(time) * 0.1,
          Math.cos(time * 0.7) * 0.05,
          Math.sin(time * 0.5) * 0.1
        ),
        glassesRotation: {
          x: Math.sin(time * 0.3) * 0.1,
          y: Math.cos(time * 0.2) * 0.1,
          z: Math.sin(time * 0.4) * 0.05,
        },
        scale: 1 + Math.sin(time * 0.5) * 0.1,
      });
    }, 33); // ~30 FPS

    return () => clearInterval(interval);
  }, []);

  return positions;
};

const VTOApp = () => {
  const [showOccluder, setShowOccluder] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const positions = useFaceDetection();

  const toggleOccluder = () => setShowOccluder(!showOccluder);
  const toggleDebugMode = () => setDebugMode(!debugMode);

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden shadow-lg">
        {/* Video background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <span className="text-white text-lg opacity-50">Camera Feed</span>
        </div>

        {/* 3D Canvas overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            gl={{
              alpha: true,
              antialias: true,
              sortObjects: true,
            }}
          >
            <Suspense fallback={null}>
              {showOccluder && (
                <FaceOccluder positions={positions} isDebug={debugMode} />
              )}
              <GlassesModel positions={positions} />

              {/* Lighting */}
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                castShadow
              />
              <pointLight position={[-5, -5, 5]} intensity={0.4} />
            </Suspense>

            <Stats />
          </Canvas>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 space-x-4">
        <button
          onClick={toggleOccluder}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            showOccluder
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {showOccluder ? "Tắt Occluder" : "Bật Occluder"}
        </button>

        <button
          onClick={toggleDebugMode}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            debugMode
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          {debugMode ? "Tắt Debug" : "Bật Debug"}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-gray-600 text-sm max-w-md">
        <p>
          <strong>Occluder:</strong> Che khuất phần mặt phía sau kính
          <br />
          <strong>Debug Mode:</strong> Hiển thị occluder để kiểm tra vị trí
          <br />
          <strong>Demo:</strong> Mặt sẽ di chuyển tự động để test
        </p>
      </div>
    </div>
  );
};

export default VTOApp;

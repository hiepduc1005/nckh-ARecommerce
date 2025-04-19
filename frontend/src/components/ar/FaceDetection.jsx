import React, { useRef, useEffect, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Lightformer,
  Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { trackCameraPermission } from "../../utils/analytics";

// Preload mô hình để giảm độ trễ khi tải
useGLTF.preload("/models/face.glb");
useGLTF.preload("/models/trang_sua_c2ceb8.glb");

// Component FaceOccluder với tối ưu hóa
const FaceOccluder = memo(({ positions }) => {
  const { scene } = useGLTF("/models/face.glb");
  const occluderRef = useRef();
  const [isDebug, setIsDebug] = useState(true); // Có thể điều khiển qua props nếu cần

  useEffect(() => {
    if (occluderRef.current) {
      occluderRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial(
            isDebug
              ? {
                  color: 0xffffff,
                  transparent: true,
                  opacity: 0.5,
                  side: THREE.DoubleSide,
                }
              : { colorWrite: false, depthWrite: true, side: THREE.DoubleSide }
          );
        }
      });
    }
  }, [isDebug]);

  useFrame(() => {
    if (!occluderRef.current || !positions.nose) return;

    const threshold = 0.01; // Ngưỡng thay đổi để giảm tần suất cập nhật
    const { x, y, z } = positions.nose;
    const currentPos = occluderRef.current.position;

    // Chỉ cập nhật nếu thay đổi vượt ngưỡng
    if (
      Math.abs(currentPos.x - (x - 1)) > threshold ||
      Math.abs(currentPos.y - y) > threshold ||
      Math.abs(currentPos.z - (z - 1)) > threshold
    ) {
      occluderRef.current.position.set(x * 3.8, y - 0.2, z / 0.05 - 0.5);
    }

    if (positions.glassesRotation) {
      const quaternion = new THREE.Quaternion();
      const euler = new THREE.Euler(
        -positions.glassesRotation.x,
        -positions.glassesRotation.y - Math.PI,
        positions.glassesRotation.z,
        "ZYX"
      );
      quaternion.setFromEuler(euler);
      occluderRef.current.quaternion.copy(quaternion);
    }

    if (positions.scale) {
      const scaleFactor = positions.scale * 6.2;
      occluderRef.current.scale.set(
        scaleFactor * 0.01,
        scaleFactor * 0.01,
        scaleFactor * 0.01
      );
    }
  });

  return <primitive ref={occluderRef} object={scene} />;
});

// Component GlassesModel với tối ưu hóa
const GlassesModel = memo(({ positions }) => {
  const { scene, materials } = useGLTF("/models/trang_sua_c2ceb8.glb");
  const glassesRef = useRef();

  useEffect(() => {
    if (materials && materials["glasses_mirror.001"]) {
      const lensMaterial = materials["glasses_mirror.001"];
      lensMaterial.color = new THREE.Color("#FFD700");
      lensMaterial.metalness = 1.0;
      lensMaterial.roughness = 0;
      lensMaterial.envMapIntensity = 2.0;
      lensMaterial.transparent = true;
      lensMaterial.opacity = 0.6;
    }
  }, [materials]);

  useFrame(() => {
    if (!glassesRef.current || !positions.leftEye || !positions.rightEye)
      return;

    const threshold = 0.01;
    const centerX = (positions.leftEye.x + positions.rightEye.x) / 0.8;
    const centerY = (positions.leftEye.y + positions.rightEye.y) / 1.1;
    const centerZ = (positions.leftEye.z + positions.rightEye.z) / 1;

    const eyeDistance = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(
          positions.leftEye.x,
          positions.leftEye.y,
          positions.leftEye.z
        ),
        new THREE.Vector3(
          positions.rightEye.x,
          positions.rightEye.y,
          positions.rightEye.z
        )
      )
      .length();

    const offsetY = eyeDistance * 1.3;
    const adjustedY = centerY + offsetY;

    const currentPos = glassesRef.current.position;
    if (
      Math.abs(currentPos.x - centerX) > threshold ||
      Math.abs(currentPos.y - adjustedY) > threshold ||
      Math.abs(currentPos.z - centerZ) > threshold
    ) {
      glassesRef.current.position.set(centerX, adjustedY, centerZ);
    }

    if (positions.glassesRotation) {
      const quaternion = new THREE.Quaternion();
      const euler = new THREE.Euler(
        positions.glassesRotation.x + Math.PI,
        -positions.glassesRotation.y,
        positions.glassesRotation.z,
        "ZYX"
      );
      quaternion.setFromEuler(euler);
      glassesRef.current.quaternion.copy(quaternion);
    }

    const scaleFactor = eyeDistance * 3 * 3 * 4;
    glassesRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  return <primitive ref={glassesRef} object={scene} />;
});

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [eyePositions, setEyePositions] = useState({
    leftEye: new THREE.Vector3(0, 0, 0),
    rightEye: new THREE.Vector3(0, 0, 0),
    nose: new THREE.Vector3(0, 0, 0),
    glassesRotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  });
  const [showOccluder, setShowOccluder] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let cleanupFunction = null;

    const loadFaceMesh = async () => {
      try {
        const faceMeshModule = await import("@mediapipe/face_mesh");
        const FaceMesh = faceMeshModule.FaceMesh;

        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (!results.multiFaceLandmarks) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const LEFT_EYE_INDICES = [
              33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160,
              161, 246,
            ];
            const RIGHT_EYE_INDICES = [
              362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386,
              385, 384, 398,
            ];

            let leftEyeCenter = new THREE.Vector3(0, 0, 0);
            let rightEyeCenter = new THREE.Vector3(0, 0, 0);
            let noseCenter = new THREE.Vector3(
              landmarks[168].x,
              landmarks[168].y,
              landmarks[168].z
            );

            LEFT_EYE_INDICES.forEach((index) => {
              leftEyeCenter.x += landmarks[index].x;
              leftEyeCenter.y += landmarks[index].y;
              leftEyeCenter.z += landmarks[index].z;
            });
            leftEyeCenter.divideScalar(LEFT_EYE_INDICES.length);

            RIGHT_EYE_INDICES.forEach((index) => {
              rightEyeCenter.x += landmarks[index].x;
              rightEyeCenter.y += landmarks[index].y;
              rightEyeCenter.z += landmarks[index].z;
            });
            rightEyeCenter.divideScalar(RIGHT_EYE_INDICES.length);

            leftEyeCenter.x = -((leftEyeCenter.x - 0.5) * 2);
            leftEyeCenter.y = -((leftEyeCenter.y - 0.5) * 2);
            rightEyeCenter.x = -((rightEyeCenter.x - 0.5) * 2);
            rightEyeCenter.y = -((rightEyeCenter.y - 0.5) * 2);
            noseCenter.x = -((noseCenter.x - 0.5) * 2);
            noseCenter.y = -((noseCenter.y - 0.5) * 2);

            const faceWidth = Math.abs(landmarks[10].x - landmarks[338].x) * 2;
            const scaleFactor = faceWidth * 2.5;

            const forehead = landmarks[10];
            const chin = landmarks[152];
            const faceUpVector = new THREE.Vector3(
              forehead.x - chin.x,
              forehead.y - chin.y,
              forehead.z - chin.z
            ).normalize();
            const refUpVector = new THREE.Vector3(0, 1, 0);
            let headAngleX = Math.acos(faceUpVector.dot(refUpVector));
            if (forehead.z > chin.z) headAngleX = -headAngleX;

            const leftEar = landmarks[234];
            const rightEar = landmarks[454];
            const earVector = new THREE.Vector3(
              rightEar.x - leftEar.x,
              rightEar.y - leftEar.y,
              rightEar.z - leftEar.z
            ).normalize();
            const refSideVector = new THREE.Vector3(1, 0, 0);
            let headAngleY = Math.acos(earVector.dot(refSideVector));
            if (rightEar.z > leftEar.z) headAngleY = -headAngleY;

            const eyeVector = new THREE.Vector3(
              rightEyeCenter.x - leftEyeCenter.x,
              rightEyeCenter.y - leftEyeCenter.y,
              0
            ).normalize();
            const headAngleZ = Math.atan2(eyeVector.y, eyeVector.x);

            setEyePositions({
              leftEye: rightEyeCenter,
              rightEye: leftEyeCenter,
              nose: noseCenter,
              glassesRotation: { z: headAngleZ, y: headAngleY, x: headAngleX },
              scale: scaleFactor,
            });
          }
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        video.srcObject = stream;
        video.play();

        let lastTime = 0;
        let animationFrameId;
        const processFrame = async (timestamp) => {
          if (timestamp - lastTime < 33) {
            animationFrameId = requestAnimationFrame(processFrame);
            return;
          }
          lastTime = timestamp;
          await faceMesh.send({ image: video });
          animationFrameId = requestAnimationFrame(processFrame);
        };

        processFrame(0);
        cleanupFunction = () => {
          cancelAnimationFrame(animationFrameId);
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        console.error("Failed to load MediaPipe or camera:", error);
        trackCameraPermission(false);
      }
    };

    loadFaceMesh();
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, []);

  const toggleOccluder = () => setShowOccluder(!showOccluder);

  return (
    <div>
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <Canvas camera={{ position: [0, 0, 2.5] }}>
            <Suspense fallback={null}>
              {showOccluder && <FaceOccluder positions={eyePositions} />}
              <GlassesModel positions={eyePositions} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <ambientLight intensity={0.5} />
            </Suspense>
            <Stats />
          </Canvas>
        </div>
      </div>
      <button
        onClick={toggleOccluder}
        style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        {showOccluder ? "Ẩn Occluder" : "Hiện Occluder"}
      </button>
    </div>
  );
};

export default FaceDetection;

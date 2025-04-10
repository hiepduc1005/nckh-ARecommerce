import React, { useRef, useEffect, useState, Suspense } from "react";
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

// Component to load and display 3D glasses model
function GlassesModel({ positions }) {
  // Load the 3D glasses model - replace with your .glb URL
  const { scene, materials } = useGLTF("/models/trang_sua_c2ceb8.glb");
  const glassesRef = useRef();

  useEffect(() => {
    if (materials && materials["glasses_mirror.001"]) {
      const lensMaterial = materials["glasses_mirror.001"];
      lensMaterial.color = new THREE.Color("#FFD700"); // Màu vàng
      lensMaterial.metalness = 1.0;
      lensMaterial.roughness = 0;
      lensMaterial.envMapIntensity = 2.0;
      lensMaterial.transparent = true;
      lensMaterial.opacity = 0.6;
    }
  }, [materials]);

  useFrame(() => {
    if (!glassesRef.current) return;
    // Calculate position between eyes for glasses center
    const centerX = (positions.leftEye.x + positions.rightEye.x) / 0.8;
    const centerY = (positions.leftEye.y + positions.rightEye.y) / 1.1;
    const centerZ = (positions.leftEye.z + positions.rightEye.z) / 1;

    // Calculate scale based on eye distance
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

    const offsetY = eyeDistance * 1.3; // Điều chỉnh hệ số nếu cần
    const adjustedY = centerY + offsetY;

    // Update glasses position
    glassesRef.current.position.set(centerX, adjustedY, centerZ);

    if (positions.glassesRotation) {
      // Tạo quaternion từ các góc Euler, nhưng chỉ định thứ tự rõ ràng
      const quaternion = new THREE.Quaternion();
      const euler = new THREE.Euler(
        positions.glassesRotation.x + Math.PI,
        -positions.glassesRotation.y, // Vẫn đảo dấu cho trục Y
        positions.glassesRotation.z,
        "ZYX" // Thay đổi thứ tự xoay từ XYZ sang ZYX
      );
      quaternion.setFromEuler(euler);
      glassesRef.current.quaternion.copy(quaternion);
    }
    // Scale the glasses appropriately
    // You may need to adjust this multiplier based on your model size
    const scaleFactor = eyeDistance * 3 * 3 * 4;
    glassesRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  // Clone the scene to make it usable in React
  const glassesScene = scene.clone();

  return (
    <>
      <primitive
        ref={glassesRef}
        object={glassesScene}
        position={[0, 0, 0]}
        scale={3}
      />
    </>
  );
}

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [eyePositions, setEyePositions] = useState({
    leftEye: new THREE.Vector3(0, 0, 0),
    rightEye: new THREE.Vector3(0, 0, 0),
  });
  const [calibrationAngleX, setCalibrationAngleX] = useState(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let cleanupFunction = null;

    // Dynamically import MediaPipe libraries
    const loadFaceMesh = async () => {
      try {
        // Import FaceMesh dynamically
        const faceMeshModule = await import("@mediapipe/face_mesh");
        const FaceMesh = faceMeshModule.FaceMesh;

        // Import drawing utilities
        const drawingUtilsModule = await import("@mediapipe/drawing_utils");
        const drawConnectors = drawingUtilsModule.drawConnectors;

        // Constants for eye indices in FaceMesh
        const LEFT_EYE_INDICES = [
          33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160,
          161, 246,
        ];

        const RIGHT_EYE_INDICES = [
          362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385,
          384, 398,
        ];

        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (!results.multiFaceLandmarks) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];

            // Calculate eye center positions
            let leftEyeCenter = new THREE.Vector3(0, 0, 0);
            let rightEyeCenter = new THREE.Vector3(0, 0, 0);
            let noseCenter = new THREE.Vector3(
              landmarks[168].x,
              landmarks[168].y,
              landmarks[168].z
            );

            // Average left eye landmarks
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

            // Chỉnh lại hệ tọa độ Three.js
            leftEyeCenter.x = -((leftEyeCenter.x - 0.5) * 2);
            leftEyeCenter.y = -((leftEyeCenter.y - 0.5) * 2);
            rightEyeCenter.x = -((rightEyeCenter.x - 0.5) * 2);
            rightEyeCenter.y = -((rightEyeCenter.y - 0.5) * 2);
            noseCenter.x = -((noseCenter.x - 0.5) * 2);
            noseCenter.y = -((noseCenter.y - 0.5) * 2);

            const centerX = leftEyeCenter.x + rightEyeCenter.x + 5;
            const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
            const centerZ = (leftEyeCenter.z + rightEyeCenter.z) / 2;

            // Dịch kính xuống một chút để phù hợp hơn
            const offsetY = noseCenter.y - centerY;
            // Tính góc nghiêng theo trục Y
            const leftEar = landmarks[234];
            const rightEar = landmarks[454];

            const eyeDistance = new THREE.Vector3()
              .subVectors(leftEyeCenter, rightEyeCenter)
              .length();

            // Xác định kích thước kính dựa vào khoảng cách thái dương
            const faceWidth = Math.abs(landmarks[10].x - landmarks[338].x) * 2;
            const scaleFactor = faceWidth * 2.5; // Điều chỉnh kích thước hợp lý

            const forehead = landmarks[10]; // Trán
            const chin = landmarks[152]; // Cằm
            const nose = landmarks[1]; // Đỉnh mũi

            // Vector từ trán đến cằm để có được hướng ngửa/cúi
            const faceUpVector = new THREE.Vector3(
              forehead.x - chin.x,
              forehead.y - chin.y,
              forehead.z - chin.z
            ).normalize();

            const refUpVector = new THREE.Vector3(0, 1, 0);
            let headAngleX = Math.acos(faceUpVector.dot(refUpVector));

            // Xác định dấu (ngửa hay cúi)
            if (forehead.z > chin.z) {
              headAngleX = -headAngleX;
            }

            // --- Tính góc nghiêng theo trục Y (quay trái/phải) ---
            // Vector ngang từ tai trái đến tai phải
            const earVector = new THREE.Vector3(
              rightEar.x - leftEar.x,
              rightEar.y - leftEar.y,
              rightEar.z - leftEar.z
            ).normalize();

            // Vector tham chiếu (1,0,0) - vector ngang
            const refSideVector = new THREE.Vector3(1, 0, 0);

            // Góc giữa vector tai và vector tham chiếu ngang
            let headAngleY = Math.acos(earVector.dot(refSideVector));
            // Xác định dấu (quay trái hay phải)
            if (rightEar.z > leftEar.z) {
              headAngleY = -headAngleY;
            }

            // --- Tính góc nghiêng theo trục Z (nghiêng đầu) ---
            // Sử dụng vị trí mắt để tính góc nghiêng
            const eyeVector = new THREE.Vector3(
              rightEyeCenter.x - leftEyeCenter.x,
              rightEyeCenter.y - leftEyeCenter.y,
              0 // Bỏ qua thành phần z để tính góc trên mặt phẳng XY
            ).normalize();

            const headAngleZ = Math.atan2(eyeVector.y, eyeVector.x);

            // Swap left and right eye positions to match mirrored video
            setEyePositions({
              leftEye: rightEyeCenter, // Swap lại do mirroring
              rightEye: leftEyeCenter,
              nose: noseCenter,
              glassesPosition: { x: centerX, y: centerY + offsetY, z: centerZ },
              glassesRotation: { z: headAngleZ, y: headAngleY, x: headAngleX },
              scale: scaleFactor,
            });

            // Draw eye contours on 2D canvas for debugging
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            ctx.restore();
          }
        });

        // Use MediaPipe's Camera class when available or fallback to navigator.mediaDevices
        let cameraUtils;
        try {
          cameraUtils = await import("@mediapipe/camera_utils");
          const Camera = cameraUtils.Camera;

          const camera = new Camera(video, {
            onFrame: async () => {
              await faceMesh.send({ image: video });
            },
            width: 640,
            height: 480,
          });

          camera.start();
          trackCameraPermission(true);

          cleanupFunction = () => camera.stop();

          return () => camera.stop();
        } catch (error) {
          console.warn(
            "Could not load @mediapipe/camera_utils, using fallback",
            error
          );

          // Fallback to basic getUserMedia
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: 640, height: 480 },
            });
            video.srcObject = stream;
            video.play();

            trackCameraPermission(true);

            let lastTime = 0;
            let animationFrameId;
            const processFrame = async () => {
              if (timestamp - lastTime < 33) {
                animationFrameId = requestAnimationFrame(processFrame);
                return;
              }
              lastTime = timestamp;
              await faceMesh.send({ image: video });
              animationFrameId = requestAnimationFrame(processFrame);
            };

            processFrame();
            cleanupFunction = () => {
              cancelAnimationFrame(animationFrameId);
              stream.getTracks().forEach((track) => track.stop());
            };
            return () => {
              cancelAnimationFrame(animationFrameId);
              stream.getTracks().forEach((track) => track.stop());
            };
          } catch (mediaError) {
            console.error("Camera access failed:", mediaError);
            trackCameraPermission(false);
          }
        }
      } catch (error) {
        console.error("Failed to load MediaPipe:", error);
        trackCameraPermission(false);
      }
    };

    loadFaceMesh();
    return () => {
      if (cleanupFunction && typeof cleanupFunction === "function") {
        cleanupFunction();
      }
    };
  }, []);

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
        {/* Overlay the Three.js canvas directly on top of the video */}
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
            <Suspense>
              <GlassesModel positions={eyePositions} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
            </Suspense>
            <Stats />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default FaceDetection;

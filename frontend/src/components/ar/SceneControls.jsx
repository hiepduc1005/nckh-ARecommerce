import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

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

export default SceneControls;

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
// import main script and neural network model from Jeeliz FaceFilter NPM package
import { JEELIZFACEFILTER, NN_4EXPR } from "facefilter";
import { JeelizThreeFiberHelper } from "../components/ar/JeelizThreeFiberHelper";

// import THREE.js helper for VTO glasses

const _maxFacesDetected = 1; // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected);

// Loading component
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[0.1, 0.1, 0.1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
);

// Glasses component that loads and displays the GLB model
const GlassesModel = ({
  url,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    if (gltf.scene) {
      // Optimize materials for real-time rendering
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Enable shadows if needed
          child.castShadow = true;
          child.receiveShadow = true;

          // Optimize material properties for glasses
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      rotation={rotation}
      scale={scale}
      position={position}
    />
  );
};

// Occluder component - invisible but writes to depth buffer
const OccluderModel = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Create proper occluder material that writes to depth buffer
          const occluderMesh = JeelizThreeFiberHelper.create_occluder(
            child.geometry
          );
          child.material = occluderMesh.material;
          child.renderOrder = -10; // Render before glasses
        }
      });
    }
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  );
};

// This component follows the face and contains the glasses
const GlassesFollower = (props) => {
  const objRef = useRef();

  useEffect(() => {
    const threeObject3D = objRef.current;
    _faceFollowers[props.faceIndex] = threeObject3D;
  }, [props.faceIndex]);

  console.log("RENDER GlassesFollower component");

  return (
    <object3D ref={objRef}>
      {/* Occluder - invisible but blocks rendering behind face */}
      <Suspense fallback={<LoadingFallback />}>
        <OccluderModel
          url="/models/face.glb"
          scale={props.scale || 4.5}
          position={[0, 0.15, -0.37]}
          rotation={[0.45, 0, 0]}
        />
      </Suspense>

      {/* Load glasses model với vị trí tốt hơn */}
      <Suspense fallback={<LoadingFallback />}>
        <GlassesModel
          url="/models/xanh_lam_2D4A82FF.glb"
          scale={4.5}
          position={[0, 0.06, 0.01]}
          rotation={[-0.02, 0, 0]}
        />
      </Suspense>
    </object3D>
  );
};

// Component to grab Three.js camera and renderer
let _threeFiber = null;
const ThreeGrabber = (props) => {
  _threeFiber = useThree();
  useFrame(() => {
    JeelizThreeFiberHelper.update_camera(props.sizing, _threeFiber.camera);
  });
  return null;
};

const compute_sizing = () => {
  // compute size of the canvas:
  const height = window.innerHeight;
  const wWidth = window.innerWidth;
  const width = Math.min(wWidth, height);

  // compute position of the canvas:
  const top = 0;
  const left = (wWidth - width) / 2;
  return { width, height, top, left };
};

const VTOGlassesApp = () => {
  const [sizing, setSizing] = useState(compute_sizing());
  const [isInitialized] = useState(true);
  const [isDetected, setIsDetected] = useState(false);

  let _timerResize = null;

  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize) {
      clearTimeout(_timerResize);
    }
    _timerResize = setTimeout(do_resize, 200);
  };

  const do_resize = () => {
    _timerResize = null;
    const newSizing = compute_sizing();
    setSizing(newSizing);
  };

  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize();
    }
  }, [sizing]);

  const callbackReady = (errCode, spec) => {
    if (errCode) {
      console.log("AN ERROR HAPPENS. ERR =", errCode);
      return;
    }

    console.log("INFO: JEELIZFACEFILTER IS READY");
    JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect);
  };

  const callbackTrack = (detectStatesArg) => {
    // if 1 face detection, wrap in an array:
    const detectStates = detectStatesArg.length
      ? detectStatesArg
      : [detectStatesArg];

    // update video and THREE faceFollowers poses:
    JeelizThreeFiberHelper.update(detectStates, _threeFiber.camera);

    // render the video texture on the faceFilter canvas:
    JEELIZFACEFILTER.render_video();
  };

  const callbackDetect = (faceIndex, detected) => {
    setIsDetected(detected);
    if (detected) {
      console.log("FACE DETECTED - Glasses ON");
    } else {
      console.log("FACE LOST - Glasses OFF");
    }
  };

  const faceFilterCanvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => handle_resize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    JEELIZFACEFILTER.init({
      canvas: faceFilterCanvasRef.current,
      NNC: NN_4EXPR,
      maxFacesDetected: 1,
      followZRot: true,
      callbackReady,
      callbackTrack,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      JEELIZFACEFILTER.destroy();
    };
  }, [isInitialized]);

  console.log("RENDER VTOGlassesApp component");

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Detection status indicator */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "10px 15px",
          backgroundColor: isDetected
            ? "rgba(0, 255, 0, 0.8)"
            : "rgba(255, 0, 0, 0.8)",
          color: "white",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
        }}
      >
        {isDetected ? "👓 Glasses ON" : "❌ No Face Detected"}
      </div>

      {/* Canvas managed by three fiber, for AR glasses: */}
      <Canvas
        className="mirrorX"
        style={{
          position: "fixed",
          zIndex: 2,
          ...sizing,
        }}
        gl={{
          preserveDrawingBuffer: true, // allow image capture
          antialias: true,
          alpha: true,
        }}
        updateDefaultCamera={false}
      >
        <ThreeGrabber sizing={sizing} />
        {/* Add lighting for better glasses rendering */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 1, 1]} intensity={0.8} castShadow />
        <GlassesFollower faceIndex={0} scale={5.5} />
      </Canvas>

      {/* Canvas managed by FaceFilter, displaying the video */}
      <canvas
        className="mirrorX"
        ref={faceFilterCanvasRef}
        style={{
          position: "fixed",
          zIndex: 1,
          ...sizing,
        }}
        width={sizing.width}
        height={sizing.height}
      />
    </div>
  );
};

export default VTOGlassesApp;

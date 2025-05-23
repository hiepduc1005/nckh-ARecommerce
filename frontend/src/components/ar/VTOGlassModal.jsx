import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "../../assets/styles/components/modal/VTOGlassModal.scss";
import { trackARVTOSessionEnd } from "../../utils/analytics";
import { JEELIZFACEFILTER, NN_4EXPR } from "facefilter";
import { JeelizThreeFiberHelper } from "./JeelizThreeFiberHelper";
import { toast } from "react-toastify";

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
          url={props.modelUrl || "/models/xanh_lam_2D4A82FF.glb"}
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

const VTOGlassesModal = ({ isOpen, onClose, modelUrl }) => {
  const [sizing, setSizing] = useState(compute_sizing());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const faceFilterCanvasRef = useRef(null);
  const threeCanvasRef = useRef(null);

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
    if (!_timerResize && isInitialized) {
      JEELIZFACEFILTER.resize();
    }
  }, [sizing, isInitialized]);

  const callbackReady = (errCode, spec) => {
    if (errCode) {
      console.log("AN ERROR HAPPENS. ERR =", errCode);
      return;
    }

    console.log("INFO: JEELIZFACEFILTER IS READY");
    JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect);
    setIsInitialized(true);
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

  // Capture screenshot and copy to clipboard
  const handleCapture = async () => {
    if (!isDetected || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      // Create a temporary canvas to combine both layers
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Set canvas size
      tempCanvas.width = sizing.width;
      tempCanvas.height = sizing.height;

      // Get the video canvas (background)
      const videoCanvas = faceFilterCanvasRef.current;

      // Get the Three.js canvas (AR glasses overlay)
      const threeCanvas = _threeFiber?.gl?.domElement;

      if (videoCanvas && threeCanvas) {
        // Draw video background first
        tempCtx.drawImage(
          videoCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );

        // Draw AR glasses overlay on top
        tempCtx.drawImage(
          threeCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );

        // Convert to blob
        tempCanvas.toBlob(
          async (blob) => {
            try {
              // Copy to clipboard
              await navigator.clipboard.write([
                new ClipboardItem({
                  "image/png": blob,
                }),
              ]);

              console.log("Image copied to clipboard successfully!");

              // Optional: Show success message
              toast.success("Ảnh đã được copy vào clipboard!");
            } catch (clipboardError) {
              console.error("Failed to copy to clipboard:", clipboardError);

              // Fallback: Download the image instead
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `glasses-vto-${Date.now()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              toast.error(
                "Không thể copy vào clipboard, ảnh đã được tải xuống!"
              );
            }
          },
          "image/png",
          0.9
        );
      }
    } catch (error) {
      console.error("Capture failed:", error);
      alert("Lỗi khi chụp ảnh!");
    } finally {
      setIsCapturing(false);
    }
  };

  // Initialize FaceFilter when modal opens
  useEffect(() => {
    if (isOpen && faceFilterCanvasRef.current && !isInitialized) {
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
        JEELIZFACEFILTER.toggle_pause(true, true);
        JEELIZFACEFILTER.destroy();
        setIsInitialized(false);
        setIsDetected(false);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="vto-glasses-modal">
      <div className="vto-glasses-modal__overlay" onClick={onClose} />

      <div className="vto-glasses-modal__container">
        {/* Close button */}
        <button className="vto-glasses-modal__close" onClick={onClose}>
          <span>&times;</span>
        </button>

        {/* Detection status indicator */}
        <div
          className={`vto-glasses-modal__status ${
            isDetected ? "detected" : "not-detected"
          }`}
        >
          {isDetected ? "👓 Glasses ON" : "❌ No Face Detected"}
        </div>

        {/* AR Content */}
        <div className="vto-glasses-modal__content">
          {/* Canvas managed by three fiber, for AR glasses */}
          <Canvas
            ref={threeCanvasRef}
            className="vto-glasses-modal__canvas vto-glasses-modal__canvas--ar mirrorX"
            gl={{
              preserveDrawingBuffer: true,
              antialias: true,
              alpha: true,
            }}
          >
            <ThreeGrabber sizing={sizing} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[0, 1, 1]} intensity={0.8} castShadow />
            <GlassesFollower faceIndex={0} scale={5.5} modelUrl={modelUrl} />
          </Canvas>

          {/* Canvas managed by FaceFilter, displaying the video */}
          <canvas
            className="vto-glasses-modal__canvas vto-glasses-modal__canvas--video mirrorX"
            ref={faceFilterCanvasRef}
            width={sizing.width}
            height={sizing.height}
          />
        </div>

        {/* Action buttons */}
        <div className="vto-glasses-modal__actions">
          <button
            className={`vto-glasses-modal__btn vto-glasses-modal__btn--capture ${
              !isDetected || isCapturing ? "disabled" : ""
            }`}
            onClick={handleCapture}
            disabled={!isDetected || isCapturing}
          >
            {isCapturing ? "📸 Đang chụp..." : "📸 Capture"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VTOGlassesModal;

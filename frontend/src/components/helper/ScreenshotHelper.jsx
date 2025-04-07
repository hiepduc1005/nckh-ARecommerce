import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const ScreenshotHelper = ({ cameraRef }) => {
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
};

export default ScreenshotHelper;

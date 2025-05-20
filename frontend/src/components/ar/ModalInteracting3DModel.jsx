import React, { useEffect, useState } from "react";
import Interactive3DViewer from "./Interactive3DViewer";
import "../../assets/styles/components/modal/ModalInteracting3DModel.scss";
import { useGLTF } from "@react-three/drei";

const ModalInteracting3DModel = ({
  isOpen,
  onClose,
  onSave,
  modelUrl,
  setConfig,
  config,
}) => {
  const [colorConfig, setColorConfig] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize colorConfig from props when config changes or modal opens
  useEffect(() => {
    if (config && isOpen) {
      setColorConfig(config);
      setHasChanges(false); // Reset changes flag when loading a config
    }
  }, [config, isOpen]);

  // Track changes in colorConfig
  useEffect(() => {
    // Only set hasChanges to true if colorConfig has keys and is different from initial config
    if (Object.keys(colorConfig).length > 0) {
      // Compare with config to see if there are actual changes
      const hasRealChanges =
        JSON.stringify(colorConfig) !== JSON.stringify(config);
      setHasChanges(hasRealChanges);
    }
  }, [colorConfig, config]);

  // Cleanup model when component unmounts or when modelUrl changes
  useEffect(() => {
    return () => {
      if (modelUrl) {
        useGLTF.clear(modelUrl);
      }
    };
  }, [modelUrl]);

  // Early return if modal is not open or no model URL
  if (!isOpen || !modelUrl) return null;

  const handleOnClose = () => {
    // Update parent config and close modal
    const updatedConfig = { ...config, ...colorConfig };
    setConfig(updatedConfig);
    onClose(updatedConfig);
  };

  const handleOnSave = () => {
    // Pass the current colorConfig back to parent on save
    const updatedConfig = { ...config, ...colorConfig };
    setConfig(updatedConfig);

    // Call parent's onSave with the updated config
    if (onSave) {
      onSave(updatedConfig);
    }

    console.log("Config being saved:", updatedConfig);
  };

  const handleClearConfig = () => {
    setColorConfig({});
    setHasChanges(false);
  };

  return (
    <div className="fullscreen-modal">
      <div className="fullscreen-modal__content">
        <div className="modal-header">
          <div className="modal-title">
            <h2>Custom 3D Model Viewer</h2>
          </div>
          <div className="modal-actions">
            {hasChanges && Object.keys(colorConfig).length > 0 && (
              <>
                <button className="save-button" onClick={handleOnSave}>
                  Save
                </button>
                <button className="clear-button" onClick={handleClearConfig}>
                  Clear
                </button>
              </>
            )}
            <button className="close-btn" onClick={handleOnClose}>
              Close
            </button>
          </div>
        </div>
        <div className="fullscreen-modal__body">
          <Interactive3DViewer
            modelUrl={modelUrl}
            setColorConfig={setColorConfig}
            colorConfig={colorConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalInteracting3DModel;

import {
  Matrix4,
  Mesh,
  ShaderLib,
  ShaderMaterial,
  Vector3
} from 'three'
import * as THREE from "three";

/*
  Helper for THREE Fiber - VTO Glasses Version
*/

const superThat = (function(){
  // internal settings optimized for glasses:
  const _settings = {
    rotationOffsetX: -0.1, // Adjusted for better glasses positioning (look slightly down)
    pivotOffsetYZ: [0.0, 0.08], // Reduced Z offset to bring glasses closer to face
    
    detectionThreshold: 0.75, // sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,

    cameraMinVideoDimFov: 40 // Increased FOV for better glasses fitting
  };

  let _threeFiberCompositeObjects = null, _threeProjMatrix = null;
  const _previousSizing = {
    width: 1, height: -1
  };

  let _threeTranslation = null,
      _maxFaces = -1,
      _detectCallback = null,
      _videoElement = null,
      _scaleW = 1,
      _canvasAspectRatio = -1;
  
  function detect(detectState){
    _threeFiberCompositeObjects.forEach(function(threeFiberCompositeObject, i){
      const threeCompositeObject = threeFiberCompositeObject;
      if (!threeCompositeObject) return;

      const isDetected = threeCompositeObject.visible;
      const ds = detectState[i];
      if (isDetected && ds.detected < _settings.detectionThreshold-_settings.detectionHysteresis){
        
        // DETECTION LOST
        if (_detectCallback) _detectCallback(i, false);
        threeCompositeObject.visible = false;
      } else if (!isDetected && ds.detected > _settings.detectionThreshold+_settings.detectionHysteresis){
        
        // FACE DETECTED
        if (_detectCallback) _detectCallback(i, true);
        threeCompositeObject.visible = true;
      }
    }); //end loop on all detection slots
  }

  function update_poses(ds, threeCamera){
    // tan( <horizontal FoV> / 2 ):
    const halfTanFOVX = Math.tan(threeCamera.aspect * threeCamera.fov * Math.PI/360);

    _threeFiberCompositeObjects.forEach(function(threeFiberCompositeObject, i){
      const threeCompositeObject = threeFiberCompositeObject;
      if (!threeCompositeObject) return;
      if (!threeCompositeObject.visible) return;
      const detectState = ds[i];

      const cz = Math.cos(detectState.rz), sz = Math.sin(detectState.rz);
      
      // relative width of the detection window (increased scale factor):
      const W = detectState.s * _scaleW * 1.8; // Tăng từ 1.5 lên 1.8 để kính to hơn

      // distance calculations for glasses positioning:
      const DFront = 1 / ( 2 * W * halfTanFOVX );
      const D = DFront + 0.3; // Reduced distance to bring glasses closer

      // coords in 2D of the center of the detection window:
      const xv = detectState.x * _scaleW;
      const yv = detectState.y * _scaleW;

      // coords in 3D for glasses positioning:
      const z = -D;
      const x = xv * D * halfTanFOVX;
      const y = yv * D * halfTanFOVX / _canvasAspectRatio;

      // set position before pivot (adjusted for glasses):
      threeCompositeObject.position.set(
        -sz * _settings.pivotOffsetYZ[0], 
        -cz * _settings.pivotOffsetYZ[0], 
        -_settings.pivotOffsetYZ[1]
      );

      // set rotation optimized for glasses:
      threeCompositeObject.rotation.set(
        detectState.rx + _settings.rotationOffsetX, 
        detectState.ry, 
        detectState.rz, 
        "ZYX"
      );
      threeCompositeObject.position.applyEuler(threeCompositeObject.rotation);

      // add translation part:
      _threeTranslation.set(
        x, 
        y + _settings.pivotOffsetYZ[0], 
        z + _settings.pivotOffsetYZ[1]
      );
      threeCompositeObject.position.add(_threeTranslation);
    });
  }

  // public methods:
  const that = {
    init: function(spec, threeObjects, detectCallback){
      _maxFaces = spec.maxFacesDetected;
      _videoElement = spec.videoElement;
      _threeFiberCompositeObjects = threeObjects;

      if (typeof(detectCallback) !== 'undefined'){
        _detectCallback = detectCallback;
      }

      _threeTranslation = new Vector3();
      _threeProjMatrix = new Matrix4();
    },

    update: function(detectStates, threeCamera){
      detect(detectStates);
      update_poses(detectStates, threeCamera);
    }, 

    // create an occluder for realistic glasses rendering:
    create_occluder: function(occluderGeometry){
      const occluderMaterial = new ShaderMaterial({
          vertexShader: ShaderLib.basic.vertexShader,
          fragmentShader: `
            precision lowp float;
            void main(void){
              gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
          `,
          uniforms: ShaderLib.basic.uniforms,
          colorWrite: false,      // Không viết màu
          depthWrite: true,       // Viết depth buffer
          depthTest: true,        // Test depth
          transparent: false,     // Không trong suốt
          side: THREE.DoubleSide, // Render cả hai mặt để che khuất tốt hơn khi quay
          alphaToCoverage: false
        });
      const occluderMesh = new Mesh(occluderGeometry, occluderMaterial);        
      occluderMesh.renderOrder = -10; // Render trước kính
      return occluderMesh;
    },
    
    update_camera: function(sizing, threeCamera){
      if (_maxFaces === -1) return;

      // reset camera position:
      if (threeCamera.matrixAutoUpdate){
        threeCamera.matrixAutoUpdate = false;
        threeCamera.position.set(0, 0, 0);
        threeCamera.updateMatrix();
      }

      // compute aspectRatio:
      const cvw = sizing.width;
      const cvh = sizing.height;
      _canvasAspectRatio = cvw / cvh;

      // compute vertical field of view:
      const vw = _videoElement.videoWidth;
      const vh = _videoElement.videoHeight;
      const videoAspectRatio = vw / vh;
      const fovFactor = (vh > vw) ? (1.0 / videoAspectRatio) : 1.0;
      const fov = _settings.cameraMinVideoDimFov * fovFactor;
            
      // compute scaling and offsets:
      let scale = 1.0;
      if (_canvasAspectRatio > videoAspectRatio) {
        scale = cvw / vw;
      } else {
        scale = cvh / vh;
      }
      const cvws = vw * scale, cvhs = vh * scale;
      const offsetX = (cvws - cvw) / 2.0;
      const offsetY = (cvhs - cvh) / 2.0;
      _scaleW = cvw / cvws;

      if (_previousSizing.width === sizing.width && _previousSizing.height === sizing.height
        && threeCamera.fov === fov
        && threeCamera.view.offsetX === offsetX && threeCamera.view.offsetY === offsetY
        && threeCamera.projectionMatrix.equals(_threeProjMatrix) ){
       
        return; // nothing changed
      }
      Object.assign(_previousSizing, sizing);
      
      // apply parameters:
      threeCamera.aspect = _canvasAspectRatio;
      threeCamera.fov = fov;
      threeCamera.view = null;
      console.log('INFO in JeelizThreeFiberHelper.update_camera(): camera vertical estimated FoV is', fov, 'deg');
      threeCamera.setViewOffset(cvws, cvhs, offsetX, offsetY, cvw, cvh);
      threeCamera.updateProjectionMatrix();      
      _threeProjMatrix.copy(threeCamera.projectionMatrix);
    }
  }
  return that;
})();

export const JeelizThreeFiberHelper = superThat;
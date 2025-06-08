import { format } from "date-fns";
import CryptoJS from "crypto-js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const SECRET_KEY = "1005";
export const LOCATIONIQ = "pk.faf3d66fd55714f726b3656386e724e2"
const shopLat = 21.057141432971815;
const shopLon = 105.76381039101452;

export const SOCKET_URL = "http://localhost:8080/chat"

export function calculateShippingFee(distance) {
  if (distance <= 2) {
      return 15000;
  } else if (distance <= 5) {
      return 30000;
  } else if (distance <= 10) {
      return 40000;
  } else {
      return 50000;
  }
}

export function convertToVNDFormat(amount, options = {}) {
  const {
    locale = 'vi-VN',
    currency = 'VND',
    useGrouping = true
  } = options;
  
  // Sử dụng API Intl.NumberFormat để định dạng số theo chuẩn quốc tế
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    useGrouping: useGrouping,
    maximumFractionDigits: 0
  }).format(amount);
}


export function calculateDistance(lat, lon) {
  const r = 6371; // Bán kính Trái Đất tính bằng kilômét

  // Hàm phụ để chuyển đổi độ sang radian
  const toRadians = (degrees) => degrees * Math.PI / 180;

  // Chuyển đổi vĩ độ và kinh độ sang radian
  const lat1Rad = toRadians(shopLat);
  const lon1Rad = toRadians(shopLon);
  const lat2Rad = toRadians(lat);
  const lon2Rad = toRadians(lon);

  // Tính chênh lệch vĩ độ và kinh độ
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Công thức Haversine
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Khoảng cách tính bằng kilômét
  const distance = r * c;
  return distance.toFixed(2);
}

const isLeapYear = (year) => {
    if(+year % 400 === 0 || (+year % 4 === 0 && +year % 100 !== 0)){
        return true;
    }
    return false;
}

export const isValidDate = (day , month, year) => {
    let isValidDate = true;

    if(day <= 0 || month <= 0 || month > 12 || year <= 0){
        return false;
    }
    if(+month === 1 || +month === 3 || +month === 5 || +month === 7 || +month === 8 || +month === 10 || +month === 12){
        if( day > 31){
            isValidDate = false;
        }
    }
    else if(+month === 4 || +month === 6 || +month === 9 || +month === 11){
        if( day > 30){
            isValidDate = false;
        }
    }else{
        if(isLeapYear(year)){
            isValidDate = day > 29 ? false : isValidDate;
        }else{
            isValidDate = day > 28 ? false : isValidDate;
        }
    }

    return isValidDate;
}

export const isValidPhoneNum = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(regexPhoneNumber) ? true : false;
}

export const  isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const formatToVNDate = (date) => {
    if(date){
        return format(new Date(date), "dd/MM/yyyy, HH:mm:ss")
    }
}

export const formatToVNDateDMY = (date) => {
    if(date){
        return format(new Date(date), "dd/MM/yyyy")
    }
}

export const formatToVNDateYMD = (date) => {
    if(date){
        return format(new Date(date), "yyyy-MM-dd")
    }
}


export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

export const encryptData = (data) => {
    if (data) {
        return CryptoJS.Rabbit.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    }
    return null;
};

export const decryptData = (data) => {
    if (data) {
        const bytes = CryptoJS.Rabbit.decrypt(data, SECRET_KEY);
        console.log(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)))
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return null;
};

export const generateCodeVerifier = () => {
    const array = new Uint32Array(56);  // Create an array of 56 random numbers
    window.crypto.getRandomValues(array); // Populate the array with random values
    return Array.from(array, dec => dec.toString(36)).join(''); // Convert numbers to base-36 and join them into a string
}
  
export const generateCodeChallenge = (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Create a SHA-256 hash of the codeVerifier
    return window.crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        // Convert the hash to base64-url encoding (as per PKCE spec)
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const base64 = btoa(String.fromCharCode.apply(null, hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');  // Remove padding
        return base64;
    });
}

export function generateSessionId(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }


// Hàm để chụp ảnh từ model 3D với tùy chọn tô màu
export const captureModelImage = async (modelFile, colorConfig = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Tạo một canvas tạm thời
      const canvas = document.createElement("canvas");
      canvas.width = 800; // Tăng kích thước để có chất lượng tốt hơn
      canvas.height = 800;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true, // Quan trọng để capture ảnh
      });
      
      // Đổi màu nền thành trắng và tăng cường ánh sáng
      renderer.setClearColor(0xffffff, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Cài đặt tone mapping để ảnh sáng hơn
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 2.5; // Tăng exposure cao hơn
      renderer.outputEncoding = THREE.sRGBEncoding;

      // Tạo cảnh và camera
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5); // Nền xám nhạt thay vì trắng hoàn toàn
      
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000); // Giảm FOV để tập trung hơn
      camera.position.set(4, 3, 6); // Điều chỉnh vị trí camera
      camera.lookAt(0, 0, 0);

      // HỆ THỐNG ÁNH SÁNG ĐƯỢC CẢI THIỆN MẠNH
      
      // 1. Ambient Light - Ánh sáng môi trường mạnh
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      // 2. Key Light - Ánh sáng chính từ trước
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
      keyLight.position.set(5, 8, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      scene.add(keyLight);

      // 3. Fill Light - Ánh sáng phụ từ bên trái
      const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
      fillLight.position.set(-3, 4, 2);
      scene.add(fillLight);

      // 4. Back Light - Ánh sáng từ phía sau để tạo chiều sâu
      const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
      backLight.position.set(-2, 2, -3);
      scene.add(backLight);

      // 5. Rim Light - Ánh sáng viền từ trên cao
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
      rimLight.position.set(0, 10, -5);
      scene.add(rimLight);

      // 6. Point Lights - Thêm các nguồn sáng điểm
      const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
      pointLight1.position.set(3, 3, 3);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xffffff, 1.2, 50);
      pointLight2.position.set(-3, 3, 3);
      scene.add(pointLight2);

      // 7. Hemisphere Light - Ánh sáng bầu trời
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
      hemiLight.position.set(0, 20, 0);
      scene.add(hemiLight);

      // Xác định loại file
      const fileExtension = modelFile.name.split(".").pop().toLowerCase();
      const objectUrl = URL.createObjectURL(modelFile);

      // Hàm áp dụng material sáng hơn
      function applyBrightMaterial(object) {
        object.traverse((child) => {
          if (child.isMesh) {
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            
            // Sử dụng MeshStandardMaterial với cài đặt sáng
            const newMaterial = new THREE.MeshStandardMaterial({
              color: 0xcccccc, // Màu sáng hơn
              metalness: 0.1,   // Giảm tính kim loại
              roughness: 0.3,   // Giảm độ nhám để phản xạ nhiều hơn
              emissive: 0x333333, // Thêm ánh sáng phát ra
              emissiveIntensity: 0.1,
            });
            
            child.material = newMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }

      // Hàm áp dụng cấu hình màu sắc được cải thiện
      function applyColorConfig(object, colorConfig) {
        object.traverse((child) => {
          if (child.name && colorConfig[child.name]) {
            const colorData = colorConfig[child.name];
            const color = new THREE.Color(colorData.color);
            
            if (child.isMesh) {
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
              }
              
              // Sử dụng MeshStandardMaterial với cài đặt sáng
              const newMaterial = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.1,
                roughness: 0.4,
                emissive: color.clone().multiplyScalar(0.1), // Thêm chút phát sáng
                emissiveIntensity: 0.05,
              });
              
              // Sao chép texture nếu có
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material = child.material.map(mat => {
                    const newMat = newMaterial.clone();
                    if (mat.map) newMat.map = mat.map;
                    if (mat.normalMap) newMat.normalMap = mat.normalMap;
                    return newMat;
                  });
                } else {
                  if (child.material.map) newMaterial.map = child.material.map;
                  if (child.material.normalMap) newMaterial.normalMap = child.material.normalMap;
                  child.material = newMaterial;
                }
              } else {
                child.material = newMaterial;
              }
              
              child.castShadow = true;
              child.receiveShadow = true;
            }
          } else if (child.isMesh) {
            // Áp dụng material mặc định sáng
            applyBrightMaterial(child.parent || object);
          }
        });
      }

      // Xử lý tùy theo loại file
      const loaderCallbacks = {
        onLoad: (loadedObject) => {
          const model = loadedObject.scene || loadedObject;
          
          // Áp dụng màu sắc
          if (colorConfig) {
            applyColorConfig(model, colorConfig);
          } else {
            applyBrightMaterial(model);
          }
          
          processLoadedModel(model);
        },
        onProgress: (xhr) => {
          // Progress callback
        },
        onError: (error) => {
          console.error("Lỗi khi load model:", error);
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      // Load model theo loại file
      if (fileExtension === "obj") {
        const loader = new OBJLoader();
        loader.load(objectUrl, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
      } else if (fileExtension === "glb" || fileExtension === "gltf") {
        const loader = new GLTFLoader();
        loader.load(objectUrl, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
      } else if (fileExtension === "fbx") {
        const loader = new FBXLoader();
        loader.load(objectUrl, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
      } else {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Định dạng file không được hỗ trợ"));
      }

      function processLoadedModel(model) {
        try {
          // Tự động điều chỉnh kích thước và vị trí
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3.5 / maxDim; // Tăng từ 2.5 lên 3.5 để model to hơn
          model.scale.set(scale, scale, scale);

          model.position.x = -center.x * scale -1;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;

          // Điều chỉnh góc xoay để hiển thị tốt hơn
          model.rotation.x = -Math.PI / 12; // Nghiêng nhẹ
          model.rotation.y = Math.PI / 2;   // Tăng từ PI/6 lên PI/3 để xoay sang phải hơn

          scene.add(model);

          // Điều chỉnh camera để nhìn model tốt hơn
          camera.position.set(
            center.x * scale + 4,
            center.y * scale + 3,
            center.z * scale + 6
          );
          camera.lookAt(
            center.x * scale,
            center.y * scale,
            center.z * scale
          );

          // Render với chất lượng cao
          renderer.setSize(800, 800);
          
          // Render nhiều lần để đảm bảo chất lượng
          for (let i = 0; i < 5; i++) {
            renderer.render(scene, camera);
          }

          // Đợi một chút để đảm bảo render hoàn thành
          setTimeout(() => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Không thể tạo ảnh từ canvas"));
                  return;
                }

                const imageFile = new File(
                  [blob],
                  `${modelFile.name.split(".")[0]}-preview.png`,
                  { type: "image/png" }
                );

                // Giải phóng bộ nhớ
                cleanup();
                resolve(imageFile);
              },
              "image/png",
              1.0
            );
          }, 100);

        } catch (error) {
          cleanup();
          reject(error);
        }
      }

      function cleanup() {
        URL.revokeObjectURL(objectUrl);
        renderer.dispose();
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }

    } catch (error) {
      console.error("Lỗi khi chụp ảnh model:", error);
      reject(error);
    }
  });
};


  // Hàm để chụp ảnh từ model 3D sử dụng URL đến file
  export const captureModelImageFromURL = async (modelURL, colorConfig = null) => {
    return new Promise((resolve, reject) => {
      try {
        // Tạo một canvas tạm thời
        const canvas = document.createElement("canvas");
        canvas.width = 800; // Tăng kích thước để có chất lượng tốt hơn
        canvas.height = 800;
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true, // Quan trọng để capture ảnh
        });
        
        // Đổi màu nền thành trắng và tăng cường ánh sáng
        renderer.setClearColor(0xffffff, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Cài đặt tone mapping để ảnh sáng hơn
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.5; // Tăng exposure cao hơn
        renderer.outputEncoding = THREE.sRGBEncoding;
  
        // Tạo cảnh và camera
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5); // Nền xám nhạt thay vì trắng hoàn toàn
        
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000); // Giảm FOV để tập trung hơn
        camera.position.set(4, 3, 6); // Điều chỉnh vị trí camera
        camera.lookAt(0, 0, 0);
  
        // HỆ THỐNG ÁNH SÁNG ĐƯỢC CẢI THIỆN MẠNH
        
        // 1. Ambient Light - Ánh sáng môi trường mạnh
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
  
        // 2. Key Light - Ánh sáng chính từ trước
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        scene.add(keyLight);
  
        // 3. Fill Light - Ánh sáng phụ từ bên trái
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
        fillLight.position.set(-3, 4, 2);
        scene.add(fillLight);
  
        // 4. Back Light - Ánh sáng từ phía sau để tạo chiều sâu
        const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
        backLight.position.set(-2, 2, -3);
        scene.add(backLight);
  
        // 5. Rim Light - Ánh sáng viền từ trên cao
        const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
        rimLight.position.set(0, 10, -5);
        scene.add(rimLight);
  
        // 6. Point Lights - Thêm các nguồn sáng điểm
        const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
        pointLight1.position.set(3, 3, 3);
        scene.add(pointLight1);
  
        const pointLight2 = new THREE.PointLight(0xffffff, 1.2, 50);
        pointLight2.position.set(-3, 3, 3);
        scene.add(pointLight2);
  
        // 7. Hemisphere Light - Ánh sáng bầu trời
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);
  
        // Trích xuất định dạng file từ URL
        const urlParts = modelURL.split('.');
        const fileExtension = urlParts[urlParts.length - 1].toLowerCase();
        
        // Lấy tên file từ URL để đặt tên cho file ảnh xuất ra
        const pathParts = modelURL.split('/');
        const fileName = pathParts[pathParts.length - 1].split('?')[0]; // Loại bỏ query params nếu có
  
        // Hàm áp dụng material sáng hơn
        function applyBrightMaterial(object) {
          object.traverse((child) => {
            if (child.isMesh) {
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
              }
              
              // Sử dụng MeshStandardMaterial với cài đặt sáng
              const newMaterial = new THREE.MeshStandardMaterial({
                color: 0xcccccc, // Màu sáng hơn
                metalness: 0.1,   // Giảm tính kim loại
                roughness: 0.3,   // Giảm độ nhám để phản xạ nhiều hơn
                emissive: 0x333333, // Thêm ánh sáng phát ra
                emissiveIntensity: 0.1,
              });
              
              child.material = newMaterial;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        }
  
        // Hàm áp dụng cấu hình màu sắc được cải thiện
        function applyColorConfig(object, colorConfig) {
          object.traverse((child) => {
            if (child.name && colorConfig[child.name]) {
              const colorData = colorConfig[child.name];
              const color = new THREE.Color(colorData.color);
              
              if (child.isMesh) {
                if (!child.userData.originalMaterial) {
                  child.userData.originalMaterial = child.material;
                }
                
                // Sử dụng MeshStandardMaterial với cài đặt sáng
                const newMaterial = new THREE.MeshStandardMaterial({
                  color: color,
                  metalness: 0.1,
                  roughness: 0.4,
                  emissive: color.clone().multiplyScalar(0.1), // Thêm chút phát sáng
                  emissiveIntensity: 0.05,
                });
                
                // Sao chép texture nếu có
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material = child.material.map(mat => {
                      const newMat = newMaterial.clone();
                      if (mat.map) newMat.map = mat.map;
                      if (mat.normalMap) newMat.normalMap = mat.normalMap;
                      return newMat;
                    });
                  } else {
                    if (child.material.map) newMaterial.map = child.material.map;
                    if (child.material.normalMap) newMaterial.normalMap = child.material.normalMap;
                    child.material = newMaterial;
                  }
                } else {
                  child.material = newMaterial;
                }
                
                child.castShadow = true;
                child.receiveShadow = true;
              }
            } else if (child.isMesh) {
              // Áp dụng material mặc định sáng
              applyBrightMaterial(child.parent || object);
            }
          });
        }
  
        // Xử lý tùy theo loại file
        const loaderCallbacks = {
          onLoad: (loadedObject) => {
            const model = loadedObject.scene || loadedObject;
            
            // Áp dụng màu sắc
            if (colorConfig) {
              applyColorConfig(model, colorConfig);
            } else {
              applyBrightMaterial(model);
            }
            
            processLoadedModel(model);
          },
          onProgress: (xhr) => {
            // Progress callback
          },
          onError: (error) => {
            console.error("Lỗi khi load model:", error);
            reject(error);
          }
        };
  
        // Load model theo loại file
        if (fileExtension === "obj") {
          const loader = new OBJLoader();
          loader.load(modelURL, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
        } else if (fileExtension === "glb" || fileExtension === "gltf") {
          const loader = new GLTFLoader();
          loader.load(modelURL, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
        } else if (fileExtension === "fbx") {
          const loader = new FBXLoader();
          loader.load(modelURL, loaderCallbacks.onLoad, loaderCallbacks.onProgress, loaderCallbacks.onError);
        } else {
          reject(new Error("Định dạng file không được hỗ trợ"));
        }
  
        function processLoadedModel(model) {
          try {
            // Tự động điều chỉnh kích thước và vị trí
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
  
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.5 / maxDim; // Tăng từ 2.5 lên 3.5 để model to hơn
            model.scale.set(scale, scale, scale);
  
            model.position.x = -center.x * scale - 1;
            model.position.y = -center.y * scale;
            model.position.z = -center.z * scale;
  
            // Điều chỉnh góc xoay để hiển thị tốt hơn
            model.rotation.x = -Math.PI / 12; // Nghiêng nhẹ
            model.rotation.y = Math.PI / 2;   // Tăng từ PI/6 lên PI/3 để xoay sang phải hơn
  
            scene.add(model);
  
            // Điều chỉnh camera để nhìn model tốt hơn
            camera.position.set(
              center.x * scale + 4,
              center.y * scale + 3,
              center.z * scale + 6
            );
            camera.lookAt(
              center.x * scale,
              center.y * scale,
              center.z * scale
            );
  
            // Render với chất lượng cao
            renderer.setSize(800, 800);
            
            // Render nhiều lần để đảm bảo chất lượng
            for (let i = 0; i < 5; i++) {
              renderer.render(scene, camera);
            }
  
            // Đợi một chút để đảm bảo render hoàn thành
            setTimeout(() => {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error("Không thể tạo ảnh từ canvas"));
                    return;
                  }
  
                  const fileNameWithoutExt = fileName.split('.')[0];
                  const imageFile = new File(
                    [blob],
                    `${fileNameWithoutExt}-preview.png`,
                    { type: "image/png" }
                  );
  
                  // Giải phóng bộ nhớ
                  cleanup();
                  resolve(imageFile);
                },
                "image/png",
                1.0
              );
            }, 100);
  
          } catch (error) {
            cleanup();
            reject(error);
          }
        }
  
        function cleanup() {
          renderer.dispose();
          scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }
  
      } catch (error) {
        console.error("Lỗi khi chụp ảnh model:", error);
        reject(error);
      }
    });
  };
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
      canvas.width = 400;
      canvas.height = 400;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      // Đổi màu nền thành trắng
      renderer.setClearColor(0xffffff, 1);
      // Bật tính năng tối ưu hóa ánh sáng
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5; // Tăng exposure để sáng hơn

      // Tạo cảnh và camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // Cải thiện hệ thống ánh sáng
      // Tăng cường ánh sáng ambient
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Tăng cường độ từ 0.5 lên 1.0
      scene.add(ambientLight);

      // Thêm nhiều nguồn ánh sáng từ các hướng khác nhau
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight1.position.set(0, 1, 2);
      scene.add(directionalLight1);

      // Thêm ánh sáng phụ từ hướng đối diện để giảm bóng tối
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight2.position.set(0, -1, -2);
      scene.add(directionalLight2);

      // Thêm ánh sáng từ bên cạnh để tăng chiều sâu
      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight3.position.set(-2, 0, 1);
      scene.add(directionalLight3);

      // Xác định loại file
      const fileExtension = modelFile.name.split(".").pop().toLowerCase();

      // Tạo URL blob để load model
      const objectUrl = URL.createObjectURL(modelFile);

      // Xử lý tùy theo loại file
      if (fileExtension === "obj") {
        const loader = new OBJLoader();
        loader.load(
          objectUrl,
          (object) => {
            // Áp dụng màu sắc nếu có colorConfig
            if (colorConfig) {
              applyColorConfig(object, colorConfig);
            } else {
              // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
              applyDefaultMaterial(object);
            }
            // Xử lý model đã load
            processLoadedModel(object, scene, camera, renderer, resolve, objectUrl);
          },
          (xhr) => {
            // Progress callback nếu cần
          },
          (error) => {
            console.error("Lỗi khi load OBJ:", error);
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        );
      } else if (fileExtension === "glb" || fileExtension === "gltf") {
        const loader = new GLTFLoader();
        loader.load(
          objectUrl,
          (gltf) => {
            // Áp dụng màu sắc nếu có colorConfig
            if (colorConfig) {
              applyColorConfig(gltf.scene, colorConfig);
            } else {
              // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
              applyDefaultMaterial(gltf.scene);
            }
            // Với GLTF, chúng ta cần lấy scene
            processLoadedModel(gltf.scene, scene, camera, renderer, resolve, objectUrl);
          },
          (xhr) => {
            // Progress callback nếu cần
          },
          (error) => {
            console.error("Lỗi khi load GLTF/GLB:", error);
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        );
      } else if (fileExtension === "fbx") {
        const loader = new FBXLoader();
        loader.load(
          objectUrl,
          (object) => {
            // Áp dụng màu sắc nếu có colorConfig
            if (colorConfig) {
              applyColorConfig(object, colorConfig);
            } else {
              // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
              applyDefaultMaterial(object);
            }
            // Xử lý model đã load
            processLoadedModel(object, scene, camera, renderer, resolve, objectUrl);
          },
          (xhr) => {
            // Progress callback nếu cần
          },
          (error) => {
            console.error("Lỗi khi load FBX:", error);
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        );
      } else {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Định dạng file không được hỗ trợ"));
      }

      // Hàm áp dụng material mặc định sáng hơn cho model nếu không có colorConfig
      function applyDefaultMaterial(object) {
        object.traverse((child) => {
          if (child.isMesh) {
            // Lưu lại material gốc nếu cần
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            
            // Tạo material mới sáng hơn với khả năng phản xạ cao
            const newMaterial = new THREE.MeshPhongMaterial({
              color: 0x333333, // Màu tối nhưng không quá đen
              shininess: 100,   // Độ bóng cao
              specular: 0x999999, // Tăng độ phản xạ ánh sáng
              emissive: 0x111111, // Thêm chút phát quang
            });
            
            child.material = newMaterial;
          }
        });
      }

      // Hàm áp dụng cấu hình màu sắc cho model
      function applyColorConfig(object, colorConfig) {
        object.traverse((child) => {
          // Kiểm tra xem đối tượng có trong cấu hình màu không
          if (child.name && colorConfig[child.name]) {
            // Lấy thông tin màu từ cấu hình
            const colorData = colorConfig[child.name];
            const hexColor = colorData.color;
            
            // Chuyển đổi mã màu hex thành màu THREE.js
            const color = new THREE.Color(hexColor);
            
            // Thêm material mới với màu đã chỉ định
            if (child.isMesh) {
              // Lưu lại material gốc nếu cần
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
              }
              
              // Nếu đối tượng đã có material, sao chép thuộc tính khác và chỉ thay đổi màu
              if (child.material) {
                if (Array.isArray(child.material)) {
                  // Nếu có nhiều material, áp dụng màu cho tất cả
                  child.material = child.material.map(mat => {
                    // Sử dụng MeshPhongMaterial thay vì MeshStandardMaterial để sáng hơn
                    const newMat = new THREE.MeshPhongMaterial({
                      color: color,
                      shininess: 100,
                      specular: 0x999999,
                    });
                    
                    // Sao chép các thuộc tính khác từ material gốc nếu cần
                    if (mat.map) newMat.map = mat.map;
                    if (mat.normalMap) newMat.normalMap = mat.normalMap;
                    
                    return newMat;
                  });
                } else {
                  // Nếu chỉ có một material
                  // Sử dụng MeshPhongMaterial thay vì MeshStandardMaterial để sáng hơn
                  const newMaterial = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: 100,
                    specular: 0x999999,
                  });
                  
                  // Sao chép các thuộc tính khác từ material gốc nếu cần
                  if (child.material.map) newMaterial.map = child.material.map;
                  if (child.material.normalMap) newMaterial.normalMap = child.material.normalMap;
                  
                  child.material = newMaterial;
                }
              } else {
                // Nếu không có material, tạo một material mới
                child.material = new THREE.MeshPhongMaterial({
                  color: color,
                  shininess: 100,
                  specular: 0x999999,
                });
              }
            }
          } else if (child.isMesh && !child.material) {
            // Nếu phần này không có trong colorConfig và không có material, áp dụng material mặc định sáng hơn
            child.material = new THREE.MeshPhongMaterial({
              color: 0x333333,
              shininess: 100,
              specular: 0x999999,
              emissive: 0x111111,
            });
          }
        });
      }

      // Hàm xử lý model sau khi đã load
      function processLoadedModel(model, scene, camera, renderer, resolve, objectUrl) {
        // Tự động điều chỉnh kích thước và vị trí của model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.set(scale, scale, scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        // Xoay model để có góc nhìn tốt hơn
        model.rotation.x = Math.PI / 10; // Giảm góc nghiêng
        model.rotation.y = Math.PI / 4; // Thêm góc xoay theo trục Y để nhìn rõ chi tiết hơn

        scene.add(model);

        // Render nhiều lần để cải thiện chất lượng hình ảnh
        for (let i = 0; i < 3; i++) {
          renderer.render(scene, camera);
        }

        // Chuyển đổi canvas thành file ảnh
        canvas.toBlob(
          (blob) => {
            const imageFile = new File(
              [blob],
              `${modelFile.name.split(".")[0]}-preview.png`,
              { type: "image/png" }
            );

            // Giải phóng bộ nhớ
            URL.revokeObjectURL(objectUrl);
            
            // Giải phóng tài nguyên Three.js
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

            resolve(imageFile);
          },
          "image/png",
          1.0 // Tăng chất lượng lên mức tối đa
        );
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
        canvas.width = 400;
        canvas.height = 400;
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        // Đổi màu nền sáng hơn
        renderer.setClearColor(0xffffff, 1);
        // Bật tính năng tối ưu hóa ánh sáng
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5; // Tăng exposure để sáng hơn
  
        // Tạo cảnh và camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);
  
        // Tăng cường hệ thống ánh sáng
        // Tăng cường ánh sáng ambient
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Tăng cường độ từ 0.5 lên 1.0
        scene.add(ambientLight);
  
        // Thêm nhiều ánh sáng định hướng từ các góc khác nhau
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2); // Tăng cường độ
        directionalLight1.position.set(0, 1, 2);
        scene.add(directionalLight1);
  
        // Thêm ánh sáng từ hướng đối diện để giảm bóng đổ
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(0, -1, -2);
        scene.add(directionalLight2);
  
        // Thêm ánh sáng từ bên trái
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight3.position.set(-2, 0, 1);
        scene.add(directionalLight3);
  
        // Trích xuất định dạng file từ URL
        const urlParts = modelURL.split('.');
        const fileExtension = urlParts[urlParts.length - 1].toLowerCase();
        
        // Lấy tên file từ URL để đặt tên cho file ảnh xuất ra
        const pathParts = modelURL.split('/');
        const fileName = pathParts[pathParts.length - 1].split('?')[0]; // Loại bỏ query params nếu có
  
        // Xử lý tùy theo loại file
        if (fileExtension === "obj") {
          const loader = new OBJLoader();
          loader.load(
            modelURL,
            (object) => {
              // Áp dụng màu sắc nếu có colorConfig
              if (colorConfig) {
                applyColorConfig(object, colorConfig);
              } else {
                // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
                applyDefaultMaterial(object);
              }
              // Xử lý model đã load
              processLoadedModel(object, scene, camera, renderer, resolve, fileName);
            },
            (xhr) => {
              // Progress callback nếu cần
            },
            (error) => {
              console.error("Lỗi khi load OBJ:", error);
              reject(error);
            }
          );
        } else if (fileExtension === "glb" || fileExtension === "gltf") {
          const loader = new GLTFLoader();
          loader.load(
            modelURL,
            (gltf) => {
              // Áp dụng màu sắc nếu có colorConfig
              if (colorConfig) {
                applyColorConfig(gltf.scene, colorConfig);
              } else {
                // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
                applyDefaultMaterial(gltf.scene);
              }
              // Với GLTF, chúng ta cần lấy scene
              processLoadedModel(gltf.scene, scene, camera, renderer, resolve, fileName);
            },
            (xhr) => {
              // Progress callback nếu cần
            },
            (error) => {
              console.error("Lỗi khi load GLTF/GLB:", error);
              reject(error);
            }
          );
        } else if (fileExtension === "fbx") {
          const loader = new FBXLoader();
          loader.load(
            modelURL,
            (object) => {
              // Áp dụng màu sắc nếu có colorConfig
              if (colorConfig) {
                applyColorConfig(object, colorConfig);
              } else {
                // Nếu không có colorConfig, áp dụng material mặc định sáng hơn
                applyDefaultMaterial(object);
              }
              // Xử lý model đã load
              processLoadedModel(object, scene, camera, renderer, resolve, fileName);
            },
            (xhr) => {
              // Progress callback nếu cần
            },
            (error) => {
              console.error("Lỗi khi load FBX:", error);
              reject(error);
            }
          );
        } else {
          reject(new Error("Định dạng file không được hỗ trợ"));
        }
  
        // Hàm áp dụng material mặc định sáng hơn cho model nếu không có colorConfig
        function applyDefaultMaterial(object) {
          object.traverse((child) => {
            if (child.isMesh) {
              // Tạo material sáng hơn với độ phản xạ tăng
              const newMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333, // Màu tối nhưng không quá đen
                shininess: 100,   // Độ bóng cao
                specular: 0x999999, // Tăng độ phản xạ ánh sáng
                emissive: 0x111111, // Thêm chút phát quang
              });
              
              // Lưu lại material gốc nếu cần
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
              }
              
              child.material = newMaterial;
            }
          });
        }
  
        // Hàm áp dụng cấu hình màu sắc cho model
        function applyColorConfig(object, colorConfig) {
          object.traverse((child) => {
            // Kiểm tra xem đối tượng có trong cấu hình màu không
            if (child.name && colorConfig[child.name]) {
              // Lấy thông tin màu từ cấu hình
              const colorData = colorConfig[child.name];
              const hexColor = colorData.color;
              
              // Chuyển đổi mã màu hex thành màu THREE.js
              const color = new THREE.Color(hexColor);
              
              // Thêm material mới với màu đã chỉ định
              if (child.isMesh) {
                // Nếu đối tượng đã có material, sao chép thuộc tính khác và chỉ thay đổi màu
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    // Nếu có nhiều material, áp dụng màu cho tất cả
                    child.material = child.material.map(mat => {
                      // Sử dụng MeshPhongMaterial thay vì MeshStandardMaterial để sáng hơn
                      const newMat = new THREE.MeshPhongMaterial({
                        color: color,
                        shininess: 100,
                        specular: 0x999999,
                      });
                      
                      // Sao chép các thuộc tính khác từ material gốc nếu cần
                      if (mat.map) newMat.map = mat.map;
                      if (mat.normalMap) newMat.normalMap = mat.normalMap;
                      
                      return newMat;
                    });
                  } else {
                    // Nếu chỉ có một material
                    // Sử dụng MeshPhongMaterial thay vì MeshStandardMaterial để sáng hơn
                    const newMaterial = new THREE.MeshPhongMaterial({
                      color: color,
                      shininess: 100,
                      specular: 0x999999,
                    });
                    
                    // Sao chép các thuộc tính khác từ material gốc nếu cần
                    if (child.material.map) newMaterial.map = child.material.map;
                    if (child.material.normalMap) newMaterial.normalMap = child.material.normalMap;
                    
                    child.material = newMaterial;
                  }
                } else {
                  // Nếu không có material, tạo một material mới
                  child.material = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: 100,
                    specular: 0x999999,
                  });
                }
              }
            } else if (child.isMesh) {
              // Nếu phần này không có trong colorConfig, áp dụng material mặc định sáng hơn
              const newMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 100,
                specular: 0x999999,
                emissive: 0x111111,
              });
              child.material = newMaterial;
            }
          });
        }
  
        // Hàm xử lý model sau khi đã load
        function processLoadedModel(model, scene, camera, renderer, resolve, fileName) {
          // Tự động điều chỉnh kích thước và vị trí của model
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
  
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3 / maxDim;
          model.scale.set(scale, scale, scale);
  
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;
  
          // Xoay model để có góc nhìn tốt hơn - điều chỉnh góc xoay
          model.rotation.x = Math.PI / 10;
          model.rotation.y = Math.PI / 4; // Thêm xoay theo trục Y để nhìn rõ hơn
  
          scene.add(model);
  
          // Render nhiều lần để cải thiện chất lượng
          for (let i = 0; i < 3; i++) {
            renderer.render(scene, camera);
          }
  
          // Chuyển đổi canvas thành file ảnh
          canvas.toBlob(
            (blob) => {
              const fileNameWithoutExt = fileName.split('.')[0];
              const imageFile = new File(
                [blob],
                `${fileNameWithoutExt}-preview.png`,
                { type: "image/png" }
              );
  
              // Giải phóng bộ nhớ
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
  
              resolve(imageFile);
            },
            "image/png",
            1.0 // Tăng chất lượng lên mức tối đa
          );
        }
      } catch (error) {
        console.error("Lỗi khi chụp ảnh model:", error);
        reject(error);
      }
    });
  };
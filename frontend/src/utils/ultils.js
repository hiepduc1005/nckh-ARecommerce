import { format } from "date-fns";
import CryptoJS from "crypto-js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const SECRET_KEY = "1005";
export const LOCATIONIQ = "pk.faf3d66fd55714f726b3656386e724e2" 
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
        renderer.setClearColor(0xf5f5f5, 1);
  
        // Tạo cảnh và camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);
  
        // Thêm ánh sáng
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
  
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 2);
        scene.add(directionalLight);
  
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
              }
              // Xử lý model đã load
              processLoadedModel(object, scene, camera, renderer, resolve);
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
            objectUrl,
            (gltf) => {
              // Áp dụng màu sắc nếu có colorConfig
              if (colorConfig) {
                applyColorConfig(gltf.scene, colorConfig);
              }
              // Với GLTF, chúng ta cần lấy scene
              processLoadedModel(gltf.scene, scene, camera, renderer, resolve);
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
            objectUrl,
            (object) => {
              // Áp dụng màu sắc nếu có colorConfig
              if (colorConfig) {
                applyColorConfig(object, colorConfig);
              }
              // Xử lý model đã load
              processLoadedModel(object, scene, camera, renderer, resolve);
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
                      const newMat = mat.clone();
                      newMat.color = color;
                      return newMat;
                    });
                  } else {
                    // Nếu chỉ có một material
                    const newMaterial = child.material.clone();
                    newMaterial.color = color;
                    child.material = newMaterial;
                  }
                } else {
                  // Nếu không có material, tạo một material mới
                  child.material = new THREE.MeshStandardMaterial({ color: color });
                }
              }
            }
          });
        }
  
        // Hàm xử lý model sau khi đã load
        function processLoadedModel(model, scene, camera, renderer, resolve) {
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
          model.rotation.x = Math.PI / 8;
  
          scene.add(model);
  
          // Render và chụp ảnh
          renderer.render(scene, camera);
  
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
  
              resolve(imageFile);
            },
            "image/png",
            0.95
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
      renderer.setClearColor(0xf5f5f5, 1);

      // Tạo cảnh và camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // Thêm ánh sáng
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 1, 2);
      scene.add(directionalLight);

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
                    const newMat = mat.clone();
                    newMat.color = color;
                    return newMat;
                  });
                } else {
                  // Nếu chỉ có một material
                  const newMaterial = child.material.clone();
                  newMaterial.color = color;
                  child.material = newMaterial;
                }
              } else {
                // Nếu không có material, tạo một material mới
                child.material = new THREE.MeshStandardMaterial({ color: color });
              }
            }
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

        // Xoay model để có góc nhìn tốt hơn
        model.rotation.x = Math.PI / 8;

        scene.add(model);

        // Render và chụp ảnh
        renderer.render(scene, camera);

        // Chuyển đổi canvas thành file ảnh
        canvas.toBlob(
          (blob) => {
            const fileNameWithoutExt = fileName.split('.')[0];
            const imageFile = new File(
              [blob],
              `${fileNameWithoutExt}-preview.png`,
              { type: "image/png" }
            );

            resolve(imageFile);
          },
          "image/png",
          0.95
        );
      }
    } catch (error) {
      console.error("Lỗi khi chụp ảnh model:", error);
      reject(error);
    }
  });
};
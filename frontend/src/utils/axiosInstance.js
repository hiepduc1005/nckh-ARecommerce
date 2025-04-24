import axios from "axios"
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    
})

// Thêm response interceptor để log khi nhận status 429
axiosInstance.interceptors.response.use(
    (response) => {
        // Trả về response nếu thành công (status 2xx)
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 429) {
            toast.error(error.response.data)
        }
        // Trả về lỗi để các phần khác của ứng dụng xử lý tiếp
        return Promise.reject(error);
    }
);
export default axiosInstance;
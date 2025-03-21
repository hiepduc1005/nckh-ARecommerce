import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
 
export const createTag = async (data,token) => {
    try {
        const res = await axiosInstance.post("api/v1/tags", data , 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if(res.status == 200){
            toast.success("Tạo tag thành công!")
        }
        return res.data
        
    } catch (error) {
        console.error(error)
        toast.error("Tạo tag thất bại!")
        return null;
    }
}



export const updateTag = async (data,token) => {
    try {
        const res = await axiosInstance.put("api/v1/tags", data , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status == 200){
            toast.success("Cập nhập tag thành công!")
        }else {
            toast.error("Cập nhập tag thất bại!")
        }
        return res.data;
        
    } catch (error) {
        toast.error("Cập nhập chỉ thất bại!")
        return null;
    }
}

export const deleteTag = async (tagId,token) => {
    try {
        const res = await axiosInstance.delete(`api/v1/tags/${tagId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status == 200){
            toast.success("Xóa tag thành công!")
        }
        
    } catch (error) {
        console.log(error)
        toast.error("Xóa tag thất bại!")
    }
}


export const getTagsPaginate = async ( page , size) => {
    try {
        const res = await axiosInstance.get(`api/v1/tags/pagination?page=${page - 1}&size=${size}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getAllTags = async () => {
    try {
        const res = await axiosInstance.get(`api/v1/tags`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 


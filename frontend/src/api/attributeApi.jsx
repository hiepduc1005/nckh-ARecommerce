import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const getAttributeValue = async (attributeId , token) => {
    try {
        const res = await axiosInstance.get(`api/v1/attribute/${attributeId}/attributeValue`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return res.data;
    } catch (error) {
        console.error()
        return null;
    }
}

export const createAttribute = async (data,token) => {
    try {
        const res = await axiosInstance.post("api/v1/attribute", data , 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if(res.status == 200){
            toast.success("Tạo Attribute thành công!")
        }
        return res.data
        
    } catch (error) {
        console.error(error)
        toast.error("Tạo Attribute thất bại!")
        return null;
    }
}



export const updateAttribute  = async (data,token) => {
    try {
        const res = await axiosInstance.put("api/v1/attribute", data , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status == 200){
            toast.success("Cập nhập Attribute thành công!")
        }else {
            toast.error("Cập nhập Attribute thất bại!")
        }
        return res.data;
        
    } catch (error) {
        toast.error("Cập nhập Attribute thất bại!")
        return null;
    }
}

export const deleteAttribute = async (attributeId,token) => {
    try {
        const res = await axiosInstance.delete(`api/v1/attribute/${attributeId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status == 200){
            toast.success("Xóa Attribute thành công!")
        }
        
    } catch (error) {
        console.log(error)
        toast.error("Xóa Attribute thất bại!")
    }
}


export const getAttributesPaginate = async ( page , size) => {
    try {
        const res = await axiosInstance.get(`api/v1/attribute/pagination?page=${page - 1}&size=${size}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getAllAttributes = async () => {
    try {
        const res = await axiosInstance.get(`api/v1/attribute`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 


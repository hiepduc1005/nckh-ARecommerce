import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const getUserAddressById = async (userAddressId,token) => {
    try {
        const res = await axiosInstance.get(`api/v1/user-address/${userAddressId}`,
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

export const getUserAddressByUserId = async (userId,token) => {
    try {
        const res = await axiosInstance.get(`api/v1/user-address/user/${userId}`,
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

export const createUserAddress = async (data,token) => {
    try {
        const res = await axiosInstance.post("api/v1/user-address", data , 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if(res.status == 200){
            toast.success("Tạo địa chỉ thành công!")
        }
        return res.data
        
    } catch (error) {
        console.error("Login failed",error)
        toast.error("Tạo chỉ thất bại!")
        return null;
    }
}



export const updateUserAddress = async (data,token) => {
    try {
        const res = await axiosInstance.put("api/v1/user-address", data , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.data == 200){
            toast.success("Cập nhập địa chỉ thành công!")
        }else {
            toast.error("Cập nhập chỉ thất bại!")
        }
        return res.data;
        
    } catch (error) {
        toast.error("Cập nhập chỉ thất bại!")
        return null;
    }
}

export const deleteUserAddress = async (userAddressId,token) => {
    try {
        const res = await axiosInstance.delete(`api/v1/user-address/${userAddressId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(res.status == 200){
            toast.success("Xóa địa chỉ thành công!")
        }
        
    } catch (error) {
        console.log(error)
        toast.error("Xóa địa chỉ thất bại!")
    }
}
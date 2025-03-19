import axiosInstance from "../utils/axiosInstance";

export const createCategory = async (data , token) => {
    try {
        const res = await axiosInstance.post("api/v1/categories",data,{
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        })

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getCategoriesPaginate = async ( page , size) => {
    try {
        const res = await axiosInstance.get(`api/v1/categories/pagination?page=${page - 1}&size=${size}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getAllCategories = async () => {
    try {
        const res = await axiosInstance.get(`api/v1/categories`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const updateCategory = async (data , token) => {
    try {
        const res = await axiosInstance.put("api/v1/categories",data,{
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        })

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 


export const deleteCategory = async ( token , categoryId ) => {
    try {
        const res = await axiosInstance.delete(`api/v1/categories/${categoryId}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return res.data
    } catch (error) {
        console.error(error)
        return null;
    }
} 
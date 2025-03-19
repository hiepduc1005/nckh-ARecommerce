import axiosInstance from "../utils/axiosInstance";

export const createBrand = async (data , token) => {
    try {
        const res = await axiosInstance.post("api/v1/brands",data,{
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

export const getBrandsPaginate = async ( page , size) => {
    try {
        const res = await axiosInstance.get(`api/v1/brands/pagination?page=${page - 1}&size=${size}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getAllBrands = async () => {
    try {
        const res = await axiosInstance.get(`api/v1/brands`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const updateBrand = async (data , token) => {
    try {
        const res = await axiosInstance.put("api/v1/brands",data,{
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


export const deleteBrand = async ( token , brandId ) => {
    try {
        const res = await axiosInstance.delete(`api/v1/brands/${brandId}`,{
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

export const getBrandBySlug = async ( slug ) => {
    try {
        const res = await axiosInstance.get(`api/v1/brands/slug/${slug}`);

        return res.data
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getBrandByName = async ( name ) => {
    try {
        const res = await axiosInstance.get(`api/v1/brands/name/${name}`);

        return res.data
    } catch (error) {
        console.error(error)
        return null;
    }
} 


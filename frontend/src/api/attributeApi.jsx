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
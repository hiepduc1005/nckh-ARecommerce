import axiosInstance from "../utils/axiosInstance";

export const createVariant = async (data, token) => {
  try {
    const res = await axiosInstance.post("api/v1/variants", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateVariant = async (data, token) => {
  try {
    const res = await axiosInstance.put("api/v1/variants", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getVariantsByProductId = async (productId, page) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/variants/products/${productId}?page=${page - 1}&size=5`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getVariantsById = async (variantId) => {
  try {
    const res = await axiosInstance.get(`api/v1/variants/${variantId}`);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVariantsByIds = async (listVariantId) => {
  try {
    const ids = listVariantId.join(",");
    const res = await axiosInstance.get(`api/v1/variants/ids`, {
      params: { ids },
    });

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVariantsByProductSlug = async (slug, token, page, size = 5) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/variants/products/slug/${slug}?page=${page - 1}&size=${size}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const deleteVariant = async (token, variantId) => {
  try {
    const res = await axiosInstance.delete(`api/v1/variants/${variantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

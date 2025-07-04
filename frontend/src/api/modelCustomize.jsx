import axiosInstance from "../utils/axiosInstance";

export const createModelCustomize = async (data, token) => {
  try {
    const res = await axiosInstance.post("api/v1/model-customize", data, {
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

export const updateModelCustomize = async (data, token) => {
  try {
    const res = await axiosInstance.put("api/v1/model-customize", data, {
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

export const createModelDesign = async (data) => {
  try {
    const res = await axiosInstance.post("api/v1/model-design", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const cloneModelDesign = async (data) => {
  try {
    const res = await axiosInstance.post("api/v1/model-design/clone", data);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getModelsByType = async (page, size, type) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/model-customize?page=${page}&size=${size}&type=${type}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getModelsDesignBySessionId = async (page, size, sessionId) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/model-design?page=${page}&size=${size}&sessionId=${sessionId}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getModelsDesignBySessionIdAndCustomizeId = async (
  page,
  size,
  sessionId,
  customizeId
) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/model-design/customzie/${customizeId}?page=${page}&size=${size}&sessionId=${sessionId}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getModelCustomizeById = async (modelId) => {
  try {
    const res = await axiosInstance.get(`api/v1/model-customize/${modelId}`);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteModelCustomize = async (token, modelId) => {
  try {
    const res = await axiosInstance.delete(
      `api/v1/model-customize/${modelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteModelDesign = async (modelId) => {
  try {
    const res = await axiosInstance.delete(`api/v1/model-design/${modelId}`);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

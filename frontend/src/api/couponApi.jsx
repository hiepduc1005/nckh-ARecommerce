import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const createCoupon = async (data, token) => {
  try {
    const res = await axiosInstance.post("api/v1/coupon", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      toast.success("Tạo Coupon thành công!");
    }
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("Tạo Coupon thất bại!");
    return null;
  }
};

export const updateCoupon = async (data, token) => {
  try {
    const res = await axiosInstance.put("api/v1/coupon", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      toast.success("Cập nhập Coupon thành công!");
    } else {
      toast.error("Cập nhập Coupon thất bại!");
    }
    return res.data;
  } catch (error) {
    toast.error("Cập nhập chỉ thất bại!");
    return null;
  }
};

export const deleteCoupon = async (couponId, token) => {
  try {
    const res = await axiosInstance.delete(`api/v1/coupon/${couponId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      toast.success("Xóa Coupon thành công!");
    }
  } catch (error) {
    console.log(error);
    toast.error("Xóa Coupon thất bại!");
  }
};

export const getCouponPaginate = async (page, size, token) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/coupon?page=${page - 1}&size=${size}`,
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

export const getCouponByCode = async (couponCode) => {
  try {
    const res = await axiosInstance.get(`api/v1/coupon/code/${couponCode}`);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCouponById = async (couponId) => {
  try {
    const res = await axiosInstance.get(`api/v1/coupon/${couponId}`);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

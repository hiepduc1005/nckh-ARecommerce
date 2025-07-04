import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import AuthLayout from "../layouts/AuthLayout";
import ProductLayout from "../layouts/ProductLayout";
import ProductDetails from "../pages/ProductDetails";
import DefaultLayout from "../layouts/DefaultLayout";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import SearchPage from "../pages/SearchPage";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import AdminProduct from "../pages/AdminProduct";
import AdminProductVariants from "../pages/AdminProductVariants";
import AdminVariants from "../pages/AdminVariants";
import CartLayout from "../layouts/CartLayout";
import UserAccountLayout from "../layouts/UserAccountLayout";
import UserAddress from "../pages/UserAddress";
import AdminProductDetails from "../pages/AdminProductDetails";
import AdminCategory from "../pages/AdminCategory";
import AdminBrand from "../pages/AdminBrand";
import AdminTag from "../pages/AdminTag";
import AdminAttribute from "../pages/AdminAttribute";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import AdminOrder from "../pages/AdminOrder";
import AdminOrderDetails from "../pages/AdminOrderDetails";
import Purchase from "../pages/Purchase";
import PurchaseProgress from "../pages/PurchaseProgress";
import AboutUs from "../pages/AboutUs";
import ReturnPolicy from "../pages/ReturnPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Interactive3DViewer from "../pages/Test";
import ShoesCustomize from "../pages/ShoesCustomize";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCoupon from "../pages/AdminCoupon";
import BrandPage from "../pages/BrandPage";
import OrderManagement from "../pages/OrderManagement";
import AdminModelCustomize from "../pages/AdminModelCustomize";
import CustomzieDetails from "../pages/CustomzieDetails";
import ShareDesign from "../pages/ShareDesign";
import GlassesCustomize from "../pages/GlassesCustomize";
import NotificationsPage from "../pages/NotificationsPage";
import ChangePassword from "../pages/ChangePassword";
import SupportPage from "../pages/SupportPage";
import AdminUser from "../pages/AdminUser";
import PaymentPolicy from "../pages/PaymentPolicy";
import WarrantyPolicy from "../pages/WarrantyPolicy";
import WishlistPage from "../pages/WishListPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment-check" element={<OrderConfirmation />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="return-policy" element={<ReturnPolicy />} />
        <Route path="brands" element={<BrandPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="payment-policy" element={<PaymentPolicy />} />
        <Route path="warranty-policy" element={<WarrantyPolicy />} />
        <Route path="wishlist" element={<WishlistPage />} />

        <Route path="test" element={<Interactive3DViewer />} />
        <Route path="customize/shoes" element={<ShoesCustomize />} />
        <Route path="customize/glasses" element={<GlassesCustomize />} />
        <Route path="customize/:customizeId" element={<CustomzieDetails />} />
        <Route path="support" element={<SupportPage />} />
      </Route>

      <Route path="/share-design/:designId" element={<ShareDesign />} />

      <Route path="/cart" element={<CartLayout />}></Route>

      <Route path="/user" element={<UserAccountLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="address" element={<UserAddress />} />
        <Route path="purchase" element={<Purchase />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="change-password" element={<ChangePassword />} />

        <Route
          path="purchase/progress/:orderCode"
          element={<PurchaseProgress />}
        />
      </Route>

      <Route path="/products" element={<ProductLayout />}>
        <Route index element={<SearchPage />} />
        <Route path=":slug" element={<ProductDetails />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="attributes" element={<AdminAttribute />} />
        <Route path="users" element={<AdminUser />} />
        <Route path="tags" element={<AdminTag />} />
        <Route path="brands" element={<AdminBrand />} />
        <Route path="products" element={<AdminProduct />} />
        <Route path="categories" element={<AdminCategory />} />
        <Route path="products/:slug" element={<AdminProductDetails />} />
        <Route path="variants" element={<AdminVariants />} />
        <Route path="orders" element={<AdminOrder />} />
        <Route path="orders/:orderId" element={<AdminOrderDetails />} />
        <Route path="coupons" element={<AdminCoupon />} />
        <Route path="orders-management" element={<OrderManagement />} />
        <Route path="model-customize" element={<AdminModelCustomize />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

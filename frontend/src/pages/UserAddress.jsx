import React, { useEffect, useState } from "react";
import "../assets/styles/pages/UserAddress.scss";
import useAuth from "../hooks/UseAuth";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddressByUserId,
} from "../api/userAddressApi";
import useLoading from "../hooks/UseLoading";
import SelectPlace from "../components/SelectPlace";

const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    document.title = "Địa chỉ";
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    specificAddress: "",
    isDefault: false,
  });
  const { user, token } = useAuth();
  const { setLoading } = useLoading();

  const fetchUserAddress = async () => {
    setLoading(true);
    if (user && token) {
      const data = await getUserAddressByUserId(user.id, token);
      if (data) {
        setAddresses(data);
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchUserAddress();
  }, [user, token]);

  const handleDeleteUserAddress = async (userAddressId) => {
    setLoading(true);

    await deleteUserAddress(userAddressId, token);
    setAddresses((prev) => prev.filter((item) => item.id !== userAddressId));

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value,
    });
  };

  const handleAddressChange = (address) => {
    console.log(address);
    setNewAddress({
      ...newAddress,
      specificAddress: address,
      address: address,
    });
  };

  const handleCheckboxChange = (e) => {
    setNewAddress({
      ...newAddress,
      isDefault: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      userId: user.id,
      phone: newAddress.phone,
      address: newAddress.address,
      specificAddress: newAddress.specificAddress,
      isDefault: newAddress.isDefault,
      name: newAddress.name,
    };

    const newUserAddress = await createUserAddress(data, token);
    if (newUserAddress) {
      fetchUserAddress();
    }

    // Reset form
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      specificAddress: "",
      isDefault: false,
    });

    // Hide form
    setShowAddForm(false);
    setLoading(false);
  };

  return (
    <div className="user-address-container">
      <div className="address-header">
        <h2>Địa chỉ của tôi</h2>
        <button
          className="add-address-btn"
          onClick={() => setShowAddForm(true)}
        >
          <span className="plus-icon">+</span>
          Thêm địa chỉ mới
        </button>
      </div>

      {showAddForm && (
        <div className="address-form-container">
          <h3>Thêm địa chỉ mới</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Họ tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAddress.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <SelectPlace
                onChange={handleAddressChange}
                setDistance={setDistance}
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Hủy
              </button>
              <button type="submit" className="submit-btn">
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="address-list">
        <div className="address-list-header">
          <span>Địa chỉ</span>
        </div>

        {addresses.map((address) => (
          <div key={address.id} className="address-item">
            <div className="address-info">
              <div className="address-name-phone">
                <span className="name">{address.name}</span>
                <span className="phone">{address.phone}</span>
              </div>
              <div className="address-details">
                <p>{address.specificAddress}</p>
              </div>
              {address.isDefault && (
                <div className="default-tag">
                  <span>Mặc định</span>
                </div>
              )}
            </div>
            <div className="address-actions">
              <button className="update-btn">Cập nhật</button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteUserAddress(address.id)}
              >
                Xóa
              </button>
              {!address.isDefault && (
                <button className="default-btn">Thiết lập mặc định</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAddress;

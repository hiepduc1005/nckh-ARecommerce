import React, { useState } from 'react';
import "../assets/styles/pages/UserAddress.scss";

const UserAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Đức Hiệp",
      phone: "(+84) 903 403 668",
      address: "Số Nhà 19, Ngõ 15b Tà Thanh Oai",
      district: "Xã Tà Thanh Oai, Huyện Thanh Trì, Hà Nội",
      isDefault: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    setNewAddress({
      ...newAddress,
      isDefault: e.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new address with unique ID
    const newAddressWithId = {
      ...newAddress,
      id: Date.now()
    };
    
    // If this is set as default, update other addresses
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    // Add the new address to the list
    setAddresses([...updatedAddresses, newAddressWithId]);
    
    // Reset form
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      district: "",
      isDefault: false
    });
    
    // Hide form
    setShowAddForm(false);
  };

  return (
    <div className='user-address-container'>
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
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="district">Quận/Huyện, Tỉnh/Thành phố</label>
              <input
                type="text"
                id="district"
                name="district"
                value={newAddress.district}
                onChange={handleInputChange}
                required
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
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
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

        {addresses.map(address => (
          <div key={address.id} className="address-item">
            <div className="address-info">
              <div className="address-name-phone">
                <span className="name">{address.name}</span>
                <span className="phone">{address.phone}</span>
              </div>
              <div className="address-details">
                <p>{address.address}</p>
                <p>{address.district}</p>
              </div>
              {address.isDefault && (
                <div className="default-tag">
                  <span>Mặc định</span>
                </div>
              )}
            </div>
            <div className="address-actions">
              <button className="update-btn">Cập nhật</button>
              <button className="delete-btn">Xóa</button>
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
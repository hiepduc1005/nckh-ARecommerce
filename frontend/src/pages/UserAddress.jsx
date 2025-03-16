import React, { useEffect, useState } from 'react';
import "../assets/styles/pages/UserAddress.scss";
import useAuth from '../hooks/UseAuth';
import { createUserAddress, deleteUserAddress, getUserAddressByUserId } from '../api/userAddressApi';
import useLoading from '../hooks/UseLoading';

const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    isDefault: false
  });
  const {user,token} = useAuth();
  const {setLoading} = useLoading();

  useEffect(() => {

    const fetchUserAddress = async () => {
      setLoading(true)
      if(user && token){
        const data = await getUserAddressByUserId(user.id , token);      
        if(data){
          setAddresses(data)
        }
      }

      setLoading(false)
    }

    fetchUserAddress();
    console.log(addresses)
  },[ user , token])


  const handleDeleteUserAddress = async (userAddressId) => {
    setLoading(true)

    await deleteUserAddress(userAddressId,token)
    setAddresses((prev) => prev.filter(item => item.id !== userAddressId))

    setLoading(false)
  }


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = {
      userId: user.id,
      phone: newAddress.phone,
      address: newAddress.address,
      district: newAddress.district,
      isDefault: newAddress.isDefault,
      name: newAddress.name,
    }

    const newUserAddress = await createUserAddress(data,token);
    if(newUserAddress){
      setAddresses((prevAddresses) => [...prevAddresses, newUserAddress]);
    }
    
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
    setLoading(false)
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
              <button className="delete-btn" onClick={() => handleDeleteUserAddress(address.id)}>Xóa</button>
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
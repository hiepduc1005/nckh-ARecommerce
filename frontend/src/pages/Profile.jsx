import React, { useEffect, useState } from 'react';
import '../assets/styles/pages/Profile.scss';
import defaultUser from '../assets/images/defaultUser.jpg';
import useAuth from '../hooks/UseAuth';
import { isValidDate, isValidPhoneNum } from '../utils/ultils';
import { toast } from 'react-toastify';
import { updateUser } from '../api/userApi';

const Profile = () => {

  const [userInfo, setUserInfo] = useState({
    username: '9n4yikub10',
    firstname: '',
    lastname: '',
    email: 'hi********@gmail.com',
    phone: '',
    gender: '', // 'Nam', 'Nữ', 'Khác'
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  });
  const {user,token} = useAuth();


  useEffect(() => {
    if(user){
      const [birthDay, birthMonth, birthYear] = user?.dateOfBirth ? user.dateOfBirth.split("/") : ["",'',''];
      setUserInfo({
        ...userInfo,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.userName || '9n4yikub10',
        email: user.email || 'hi********@gmail.com',
        phone: user.phoneNumber || '0903403668',
        birthDay : +birthDay || '',
        birthMonth : +birthMonth || '',
        birthYear: +birthYear || '',
        gender:user.gender
      });

      
    }
    
  },[user])

  const handleInputChange =  (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra số điện thoại
    if (!isValidPhoneNum(userInfo.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
  
    // Kiểm tra giá trị hợp lệ trước khi parse
    const day = Number(userInfo.birthDay);
    const month = Number(userInfo.birthMonth);
    const year = Number(userInfo.birthYear);
  
    if (!day || !month || !year || !isValidDate(day, month, year)) {
      toast.error("Ngày sinh không hợp lệ");
      return;
    }
  
    // Định dạng ngày tháng (thêm "0" nếu cần)
    const birthDay = day < 10 ? `0${day}` : day;
    const birthMonth = month < 10 ? `0${month}` : month;
    const birthDate = `${birthDay}/${birthMonth}/${year}`;
  
    const userDataUpdate = {
      id: user.id,
      email: userInfo.email,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      phone: userInfo.phone,
      dateOfBirth: birthDate,
      gender: userInfo.gender,
    };
  
    try {
      const userUpdate = await updateUser(userDataUpdate, token);
  
      if (userUpdate) {
        
        setUserInfo((prev) => ({
          ...prev,
          firstname: userUpdate.firstname || prev.firstname,
          lastname: userUpdate.lastname || prev.lastname,
          username: userUpdate.userName || prev.username,
          email: userUpdate.email || prev.email,
          phone: userUpdate.phoneNumber || prev.phone,
          gender: userUpdate.gender || prev.gender,
        }));

        toast.success("Cap nhap user thanh cong");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      console.error("Lỗi cập nhật user:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Hồ Sơ Của Tôi</h1>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="profile-divider"></div>

      <div className="profile-content">
        <div className="profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  value={userInfo.username}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Họ</label>
              <div className="input-group">
                <input
                  type="text"
                  name="firstname"
                  value={userInfo.firstname}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập họ của bạn"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tên</label>
              <div className="input-group">
                <input
                  type="text"
                  name="lastname"
                  value={userInfo.lastname}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập tên của bạn"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-group email-group">
                <span>{userInfo.email}</span>
                <a href="#" className="change-link">Thay Đổi</a>
              </div>
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <div className="input-group">
                {userInfo.phone ? (
                  <>
                    <span>{userInfo.phone}</span>
                    <a href="#" className="change-link">Thay Đổi</a>
                  </>
                ) : (
                  <a href="#" className="add-link">Thêm</a>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <div className="input-group gender-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={userInfo?.gender === 'Nam'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Nam
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={userInfo.gender === 'Nữ'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Nữ
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Khác"
                    checked={userInfo.gender === 'Khác'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Khác
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <div className="input-group date-group">
                <select
                  name="birthDay"
                  value={userInfo.birthDay}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Ngày</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  name="birthMonth"
                  value={userInfo.birthMonth}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="birthYear"
                  value={userInfo.birthYear}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Năm</option>
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group submit-group">
              <button type="submit" className="btn-save">
                Lưu
              </button>
            </div>
          </form>
        </div>

        <div className="profile-avatar">
          <div className="avatar-container">
            <img src={defaultUser} alt="Avatar" className="avatar-img" />
          </div>
          <div className="avatar-actions">
            <button className="btn-upload">Chọn Ảnh</button>
            <p className="avatar-hint">Dung lượng file tối đa 1 MB</p>
            <p className="avatar-hint">Định dạng:.JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
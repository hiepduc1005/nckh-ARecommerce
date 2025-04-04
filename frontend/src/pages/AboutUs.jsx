// AboutUs.jsx
import React from 'react';
import '../assets/styles/pages/AboutUs.scss';
import storeLogoImage from '../assets/images/HHQTV.png';
import ar3dImage from '../assets/images/3d-and-ar.png';
import paymentImage from '../assets/images/pay-background.png';
import storeBuildingImage from '../assets/images/About-Shop.png';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Header Banner */}
      <div className="about-us-banner" style={{ backgroundImage: `url(${storeBuildingImage})` }}>
        <div className="banner-content">
          <h1>Về chúng tôi</h1>
          <p>HHQTV Team</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-us-content">
        {/* Introduction Section */}
        <section className="about-section">
          <div className="section-image">
            <img src={storeLogoImage} alt="HHQTV Store Logo" />
          </div>
          <div className="section-text">
            <h2>GIỚI THIỆU VỀ HHQTV STORE</h2>
            <p>
              HHQTV Store là cửa hàng chuyên cung cấp đồ vật và kinh thời 
              trang, mang đến cho khách hàng những sản phẩm chất 
              lượng và hợp xu hướng. Với đa dạng mẫu mã, từ giày thể
              thao, giày đi đến kinh râm, kính cận thời thượng, HHQTV 
              Store luôn cập nhật những thiết kế mới nhất. Đến với HHQTV 
              Store, bạn sẽ tìm được phụ kiện hoàn hảo để khẳng định 
              phong cách riêng.
            </p>
          </div>
        </section>

        {/* AR & 3D Technology Section */}
        <section className="about-section reverse">
          <div className="section-image">
            <img src={ar3dImage} alt="AR & 3D Technology" />
          </div>
          <div className="section-text">
            <h2>CÔNG NGHỆ AR & 3D</h2>
            <p>
              HHQTV Store có hệ thống AR nhằm giúp người dùng có thể 
              thử và để động lựa chọn chiếc kính phù hợp với bản thân. 
              Ngoài ra, hệ thống hình ảnh 3D cũng giúp cho khách hàng có 
              thể quan sát từng thể từng góc cạnh của sản phẩm giày và 
              kính mắt.
            </p>
          </div>
        </section>

        {/* Payment Section */}
        <section className="about-section">
          <div className="section-image">
            <img src={paymentImage} alt="Payment Options" />
          </div>
          <div className="section-text">
            <h2>THANH TOÁN THUẬN TIỆN</h2>
            <p>
              HHQTV Store mang đến trải nghiệm mua sắm tiện lợi với 
              nhiều phương thức thanh toán đa dạng. Khách hàng có thể 
              thanh toán nhanh chóng qua chuyển khoản ngân hàng, đảm 
              bảo an toàn và tiết kiệm thời gian. Ngoài ra, chúng tôi cũng 
              hỗ trợ thanh toán bằng tiền mặt khi nhận hàng (COD) dành 
              cho những ai muốn kiểm tra sản phẩm trước khi thanh toán. 
              Mọi giao dịch đều được thực hiện minh bạch, giúp bạn an 
              tâm mua sắm.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
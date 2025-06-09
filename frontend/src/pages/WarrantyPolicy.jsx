import React, { useEffect } from "react";
import "../assets/styles/pages/WarrantyPolicy.scss";

const WarrantyPolicy = () => {
  useEffect(() => {
    document.title = "Chính sách bảo hành | HHQTV Store";
  }, []);
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">CHÍNH SÁCH BẢO HÀNH</h1>
        <p className="last-updated">Cập nhật lần cuối: 03 tháng 4, 2025</p>

        <div className="policy-section">
          <p className="intro-text">
            Chính sách bảo hành của HHQTV cam kết bảo vệ quyền lợi khách hàng và
            đảm bảo chất lượng sản phẩm, dịch vụ. Chúng tôi cung cấp dịch vụ bảo
            hành toàn diện theo các điều khoản được quy định dưới đây.
          </p>
        </div>

        <div className="policy-section">
          <p className="notice-text">
            <strong>Cam kết chất lượng:</strong> Tất cả sản phẩm của HHQTV đều
            được kiểm tra chất lượng nghiêm ngặt trước khi giao đến tay khách
            hàng. Chúng tôi đảm bảo sản phẩm hoạt động ổn định và đáp ứng các
            tiêu chuẩn chất lượng cao nhất.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="section-title">ĐIỀU KHOẢN BẢO HÀNH CHÍNH</h2>
          <p className="summary-intro">
            <em>
              Dưới đây là các điều khoản bảo hành chi tiết mà chúng tôi áp dụng
              cho từng loại sản phẩm và dịch vụ khác nhau.
            </em>
          </p>
        </div>

        <div className="policy-section">
          <div className="key-point">
            <h3 className="key-point-title">Thời gian bảo hành</h3>
            <p className="key-point-text">
              • <strong>Kính mắt:</strong> Bảo hành 12 tháng cho khung kính, 6
              tháng cho tròng kính
              <br />• <strong>Gọng kính:</strong> Bảo hành 24 tháng đối với lỗi
              kỹ thuật từ nhà sản xuất
              <br />• <strong>Tròng kính:</strong> Bảo hành 12 tháng đối với lỗi
              về độ cận, viễn, loạn thị
              <br />• <strong>Phụ kiện:</strong> Bảo hành 6 tháng cho hộp đựng,
              khăn lau, dây đeo
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Điều kiện bảo hành</h3>
            <p className="key-point-text">
              Sản phẩm được bảo hành khi có đầy đủ hóa đơn mua hàng và thẻ bảo
              hành hợp lệ. Sản phẩm phải còn trong thời hạn bảo hành và lỗi phát
              sinh thuộc trách nhiệm của nhà sản xuất, không do tác động bên
              ngoài hay sử dụng sai cách.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Quy trình bảo hành</h3>
            <p className="key-point-text">
              1. Khách hàng mang sản phẩm và giấy tờ liên quan đến cửa hàng
              <br />
              2. Nhân viên kiểm tra và xác định tình trạng sản phẩm
              <br />
              3. Lập phiếu tiếp nhận bảo hành và thông báo thời gian hoàn thành
              <br />
              4. Thực hiện sửa chữa/thay thế sản phẩm
              <br />
              5. Thông báo và giao sản phẩm cho khách hàng
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">
              Các trường hợp không được bảo hành
            </h3>
            <p className="key-point-text">
              • Sản phẩm bị hư hỏng do tác động vật lý (rơi, vỡ, móp méo)
              <br />
              • Sản phẩm bị hư hỏng do tiếp xúc với hóa chất ăn mòn
              <br />
              • Sản phẩm đã qua sửa chữa tại nơi khác không phải HHQTV
              <br />
              • Không có hóa đơn mua hàng hoặc thẻ bảo hành
              <br />• Hết thời hạn bảo hành theo quy định
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Dịch vụ sau bảo hành</h3>
            <p className="key-point-text">
              Sau khi hết thời hạn bảo hành, HHQTV vẫn cung cấp dịch vụ sửa chữa
              với mức phí hợp lý. Chúng tôi cam kết sử dụng linh kiện chính hãng
              và đảm bảo chất lượng sửa chữa. Thời gian sửa chữa thông thường từ
              3-7 ngày làm việc.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Chăm sóc và bảo quản sản phẩm</h3>
            <p className="key-point-text">
              Để đảm bảo sản phẩm có tuổi thọ cao, khách hàng nên vệ sinh sản
              phẩm định kỳ, bảo quản nơi khô ráo, tránh nhiệt độ cao và tác động
              mạnh. HHQTV cung cấp hướng dẫn chi tiết về cách chăm sóc sản phẩm.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">LIÊN HỆ BẢO HÀNH</h2>
          <p className="contact-text">
            Để được hỗ trợ bảo hành nhanh chóng, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="contact-info">
            <p>
              <strong>Email:</strong> baohanh@hhqtv.com
            </p>
            <p>
              <strong>Hotline bảo hành:</strong> 0123456789
            </p>
            <p>
              <strong>Địa chỉ:</strong> Các cửa hàng HHQTV trên toàn quốc
            </p>
            <p>
              <strong>Thời gian hỗ trợ:</strong> 8:00 - 21:00 (Thứ 2 - Chủ nhật)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;

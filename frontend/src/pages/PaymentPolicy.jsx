import React from "react";
import "../assets/styles/pages/PaymentPolicy.scss";

const PaymentPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">CHÍNH SÁCH THANH TOÁN</h1>
        <p className="last-updated">Cập nhật lần cuối: 03 tháng 4, 2025</p>

        <div className="policy-section">
          <p className="intro-text">
            Chính sách thanh toán của HHQTV ("chúng tôi", "của chúng tôi") mô tả
            các phương thức thanh toán, quy trình và điều khoản khi bạn sử dụng
            dịch vụ của chúng tôi ("Dịch vụ").
          </p>
        </div>

        <div className="policy-section">
          <p className="notice-text">
            <strong>Lưu ý quan trọng:</strong> Bằng cách sử dụng dịch vụ của
            chúng tôi, bạn đồng ý với các điều khoản thanh toán được nêu trong
            chính sách này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ
            của chúng tôi.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="section-title">TÓM TẮT CÁC ĐIỂM CHÍNH</h2>
          <p className="summary-intro">
            <em>
              Phần tóm tắt này cung cấp các điểm chính từ Chính sách Thanh toán
              của chúng tôi, nhưng bạn có thể tìm hiểu thêm chi tiết về bất kỳ
              chủ đề nào bằng cách sử dụng{" "}
              <a href="#table-of-contents" className="link">
                mục lục
              </a>{" "}
              bên dưới.
            </em>
          </p>
        </div>

        <div className="policy-section">
          <div className="key-point">
            <h3 className="key-point-title">
              Các phương thức thanh toán được chấp nhận
            </h3>
            <p className="key-point-text">
              Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa,
              MasterCard, JCB), ví điện tử (MoMo, ZaloPay, ShopeePay), chuyển
              khoản ngân hàng và thanh toán khi nhận hàng (COD). Tất cả giao
              dịch đều được bảo mật với công nghệ mã hóa SSL.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Thời gian xử lý thanh toán</h3>
            <p className="key-point-text">
              Thanh toán online được xử lý ngay lập tức. Chuyển khoản ngân hàng
              có thể mất 1-3 ngày làm việc để xác nhận. Đơn hàng sẽ được xử lý
              sau khi thanh toán được xác nhận thành công.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Chính sách hoàn tiền</h3>
            <p className="key-point-text">
              Hoàn tiền sẽ được thực hiện trong vòng 7-14 ngày làm việc kể từ
              khi yêu cầu được phê duyệt. Phương thức hoàn tiền sẽ tương ứng với
              phương thức thanh toán ban đầu. Một số trường hợp đặc biệt có thể
              áp dụng phí xử lý.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Bảo mật thông tin thanh toán</h3>
            <p className="key-point-text">
              Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn. Tất cả
              giao dịch được xử lý thông qua các cổng thanh toán bảo mật đã được
              chứng nhận PCI DSS. Thông tin thanh toán của bạn được mã hóa và
              bảo vệ ở mức độ cao nhất.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Phí giao dịch và thuế</h3>
            <p className="key-point-text">
              Giá sản phẩm đã bao gồm VAT theo quy định pháp luật Việt Nam. Phí
              vận chuyển và các phí phụ trợ (nếu có) sẽ được hiển thị rõ ràng
              trước khi bạn hoàn tất thanh toán. Chúng tôi có quyền điều chỉnh
              giá theo thời gian thực.
            </p>
          </div>

          <div className="key-point">
            <h3 className="key-point-title">Xử lý giao dịch thất bại</h3>
            <p className="key-point-text">
              Trong trường hợp giao dịch thất bại, chúng tôi sẽ thông báo ngay
              cho bạn qua email hoặc SMS. Bạn có thể thử lại thanh toán hoặc
              liên hệ với bộ phận hỗ trợ khách hàng để được trợ giúp.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">LIÊN HỆ HỖ TRỢ</h2>
          <p className="contact-text">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách thanh toán này, vui lòng
            liên hệ với chúng tôi:
          </p>
          <div className="contact-info">
            <p>
              <strong>Email:</strong> hhqtv@gmail.com
            </p>
            <p>
              <strong>Hotline:</strong> 0123456789
            </p>
            <p>
              <strong>Thời gian hỗ trợ:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPolicy;

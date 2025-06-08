import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  Star,
  ShoppingBag,
  Heart,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../assets/styles/pages/SupportPage.scss";

const SupportPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const faqData = [
    {
      id: 1,
      question: "Làm thế nào để theo dõi đơn hàng của tôi?",
      answer:
        'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và truy cập mục "Đơn hàng của tôi". Hoặc sử dụng mã đơn hàng để tra cứu trực tiếp.',
    },
    {
      id: 2,
      question: "Tôi có thể thanh toán bằng những phương thức nào?",
      answer:
        "Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng/ghi nợ, ví điện tử (MoMo, ZaloPay), chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD).",
    },
    {
      id: 3,
      question: "Thời gian giao hàng mất bao lâu?",
      answer:
        "Thời gian giao hàng thông thường là 2-5 ngày làm việc tùy theo khu vực. Đối với nội thành các thành phố lớn, hàng có thể được giao trong vòng 1-2 ngày.",
    },
    {
      id: 4,
      question: "Chính sách đổi trả như thế nào?",
      answer:
        "Bạn có thể đổi trả hàng trong vòng 7 ngày kể từ khi nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có đầy đủ bao bì, hóa đơn.",
    },
    {
      id: 5,
      question: "Làm sao để thay đổi thông tin tài khoản?",
      answer:
        'Đăng nhập vào tài khoản của bạn, chọn "Hồ sơ cá nhân" để cập nhật thông tin như tên, số điện thoại, địa chỉ email và địa chỉ giao hàng.',
    },
    {
      id: 6,
      question: "Làm thế nào để sử dụng mã giảm giá?",
      answer:
        'Khi thanh toán, nhập mã giảm giá vào ô "Mã khuyến mãi" và nhấn "Áp dụng". Mã sẽ được giảm trừ vào tổng giá trị đơn hàng nếu hợp lệ.',
    },
    {
      id: 7,
      question: "Tôi có thể hủy đơn hàng sau khi đã đặt không?",
      answer:
        "Bạn có thể hủy đơn hàng miễn phí trong vòng 30 phút sau khi đặt hàng. Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ.",
    },
    {
      id: 8,
      question: "Làm thế nào để đăng ký tài khoản thành viên?",
      answer:
        'Nhấn vào "Đăng ký" ở góc trên phải trang web, điền thông tin cá nhân và xác nhận qua email. Thành viên sẽ được hưởng nhiều ưu đãi đặc biệt.',
    },
    {
      id: 9,
      question: "Tôi quên mật khẩu, làm sao để lấy lại?",
      answer:
        'Tại trang đăng nhập, nhấn "Quên mật khẩu", nhập email đã đăng ký. Chúng tôi sẽ gửi link reset mật khẩu qua email của bạn.',
    },
    {
      id: 10,
      question: "Có phí giao hàng không?",
      answer:
        "Miễn phí giao hàng cho đơn hàng từ 500,000đ. Đơn hàng dưới 500,000đ sẽ có phí giao hàng 30,000đ cho nội thành và 50,000đ cho ngoại thành.",
    },
    {
      id: 11,
      question: "Làm thế nào để theo dõi tình trạng bảo hành?",
      answer:
        "Truy cập mục 'Bảo hành' trong tài khoản cá nhân, nhập số serial hoặc mã bảo hành để kiểm tra tình trạng và thời hạn bảo hành còn lại.",
    },
    {
      id: 12,
      question: "Tôi có thể đổi size sản phẩm không?",
      answer:
        "Có thể đổi size trong vòng 7 ngày nếu sản phẩm chưa sử dụng, còn nguyên tem mác. Khách hàng chịu phí vận chuyển đổi size.",
    },
    {
      id: 13,
      question: "Làm sao để kiểm tra sản phẩm chính hãng?",
      answer:
        "Mỗi sản phẩm có mã QR hoặc mã vạch để kiểm tra. Bạn có thể quét mã bằng ứng dụng hoặc truy cập website của hãng để xác thực.",
    },
    {
      id: 14,
      question: "Có thể mua hàng không cần tài khoản không?",
      answer:
        "Có thể mua hàng với tư cách khách vãng lai, nhưng để theo dõi đơn hàng và nhận ưu đãi tốt hơn, bạn nên đăng ký tài khoản.",
    },
    {
      id: 15,
      question: "Làm thế nào để nhận thông báo khuyến mãi?",
      answer:
        "Đăng ký nhận email marketing trong tài khoản cá nhân hoặc theo dõi fanpage Facebook, Instagram của chúng tôi để cập nhật khuyến mãi mới nhất.",
    },
    {
      id: 16,
      question: "Tôi có thể thanh toán trả góp không?",
      answer:
        "Chúng tôi hỗ trợ trả góp qua thẻ tín dụng (3-12 tháng) và các công ty tài chính như Home Credit, FE Credit cho đơn hàng từ 3,000,000đ.",
    },
    {
      id: 17,
      question: "Làm sao để báo cáo sản phẩm lỗi?",
      answer:
        "Chụp ảnh sản phẩm lỗi, truy cập 'Đơn hàng của tôi', chọn 'Báo cáo lỗi' hoặc liên hệ hotline. Chúng tôi sẽ hỗ trợ đổi/trả trong 24h.",
    },
    {
      id: 18,
      question: "Có thể thay đổi địa chỉ giao hàng sau khi đặt không?",
      answer:
        "Có thể thay đổi địa chỉ giao hàng trong vòng 2 giờ sau khi đặt hàng. Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ.",
    },
    {
      id: 19,
      question: "Làm thế nào để được tư vấn sản phẩm?",
      answer:
        "Bạn có thể chat trực tuyến, gọi hotline, hoặc để lại thông tin trong form 'Yêu cầu tư vấn'. Đội ngũ chuyên viên sẽ liên hệ trong vòng 30 phút.",
    },
    {
      id: 20,
      question: "Chính sách bảo mật thông tin cá nhân như thế nào?",
      answer:
        "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng, sử dụng mã hóa SSL và chỉ sử dụng thông tin cho mục đích xử lý đơn hàng.",
    },
    {
      id: 21,
      question: "Tôi có thể hủy đăng ký nhận email không?",
      answer:
        "Có thể hủy đăng ký bất cứ lúc nào bằng cách nhấn 'Unsubscribe' ở cuối email hoặc thay đổi cài đặt trong tài khoản cá nhân.",
    },
    {
      id: 22,
      question: "Làm sao để tham gia chương trình đại lý/cộng tác viên?",
      answer:
        "Truy cập mục 'Đối tác' trên website, điền form đăng ký với thông tin chi tiết. Chúng tôi sẽ liên hệ và hướng dẫn chi tiết trong vòng 3 ngày làm việc.",
    },
    {
      id: 23,
      question: "Có thể đặt hàng số lượng lớn được giá ưu đãi không?",
      answer:
        "Có thể đặt hàng số lượng lớn (từ 50 sản phẩm) với giá ưu đãi. Vui lòng liên hệ bộ phận kinh doanh qua email wholesale@shop.com để được báo giá.",
    },
    {
      id: 24,
      question: "Làm thế nào để kiểm tra lịch sử mua hàng?",
      answer:
        "Đăng nhập tài khoản, truy cập 'Lịch sử mua hàng' để xem tất cả đơn hàng đã mua, bao gồm thông tin chi tiết và trạng thái từng đơn hàng.",
    },
    {
      id: 25,
      question: "Tôi có thể đánh giá sản phẩm sau khi mua không?",
      answer:
        "Sau khi nhận hàng, bạn có thể đánh giá sản phẩm trong mục 'Đơn hàng của tôi'. Đánh giá của bạn sẽ giúp khách hàng khác có thêm thông tin tham khảo.",
    },
    {
      id: 26,
      question: "Có chính sách hoàn tiền không?",
      answer:
        "Chúng tôi hoàn tiền 100% cho trường hợp sản phẩm lỗi từ nhà sản xuất hoặc giao sai hàng. Tiền sẽ được hoàn về tài khoản trong vòng 3-5 ngày làm việc.",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Hotline",
      info: "0987654321",
      desc: "8:00 - 22:00 (Kể cả T7, CN)",
    },

    {
      icon: Mail,
      title: "Email",
      info: "hhqvt@gmail.com",
      desc: "Phản hồi trong 24h",
    },
  ];

  // Tính toán phân trang
  const totalPages = Math.ceil(faqData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQs = faqData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="support-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <h2 className="hero-title">Trung tâm hỗ trợ</h2>
          <p className="hero-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
      </div>

      <div className="main-container">
        {/* Main Content */}
        <div className="content-grid">
          {/* FAQ Section */}
          <div className="faq-section">
            <div className="faq-container">
              <h3>Câu hỏi thường gặp</h3>

              {/* FAQ List */}
              <div className="faq-list">
                {currentFAQs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <span>{faq.question}</span>
                    </div>
                    <div className="faq-answer">{faq.answer}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="faq-pagination">
                <button
                  className={`pagination-btn prev-btn ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="pagination-icon" />
                  Trước
                </button>

                <div className="pagination-numbers">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className={`pagination-btn next-btn ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Sau
                  <ChevronRight className="pagination-icon" />
                </button>
              </div>

              <div className="pagination-info">
                <p>
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, faqData.length)}{" "}
                  trong số {faqData.length} câu hỏi
                </p>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="contact-section">
            <div className="contact-container">
              <h3>Liên hệ với chúng tôi</h3>
              <div className="contact-methods">
                {contactMethods.map((method, index) => (
                  <div key={index} className="contact-item">
                    <div className="contact-icon">
                      <method.icon className="icon" />
                    </div>
                    <div className="contact-content">
                      <h4>{method.title}</h4>
                      <p className="contact-info">{method.info}</p>
                      <p className="contact-desc">{method.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

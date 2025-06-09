// ReturnPolicy.jsx
import React, { useEffect } from "react";
import "../assets/styles/pages/ReturnPolicy.scss";

const ReturnPolicy = () => {
  useEffect(() => {
    document.title = "Chính sách hoàn trả | HHQTV Store";
  }, []);
  return (
    <div className="return-policy-container">
      <div className="return-policy-content">
        <h1>RETURN POLICY</h1>

        <div className="last-updated">Last updated: April 03, 2025</div>

        <div className="policy-section intro">
          <p>
            Thank you for your purchase. We hope you are happy with your
            purchase. However, if you are not completely satisfied with your
            purchase for any reason, you may return it to us for a full refund
            only. Please see below for more information on our return policy.
          </p>
        </div>

        <div className="policy-section">
          <h2>RETURNS</h2>
          <p>
            All returns must be postmarked within fifteen (15) days of the
            purchase date. All returned items must be in new and unused
            condition, with all original tags and labels attached.
          </p>
        </div>

        <div className="policy-section">
          <h2>RETURN PROCESS</h2>
          <p>
            To return an item, place the item securely in its original packaging
            and include your proof of purchase, then mail your return to the
            following address:
          </p>

          <div className="address-block">
            <p>HHQTV</p>
            <p>Attn: Returns</p>
            <p>Trường Đại Học Tài Nguyên và Môi Trường</p>
            <p>Hà Nội, Từ Liêm 100000</p>
            <p>Vietnam</p>
          </div>

          <p>Return shipping charges will be paid or reimbursed by us.</p>
        </div>

        <div className="policy-section">
          <h2>REFUNDS</h2>
          <p>
            After receiving your return and inspecting the condition of your
            item, we will process your return. Please allow at least two (2)
            days from the receipt of your item to process your return. Refunds
            may take 1-2 billing cycles to appear on your credit card statement,
            depending on your credit card company. We will notify you by email
            when your return has been processed.
          </p>
        </div>

        <div className="policy-section">
          <h2>EXCEPTIONS</h2>
          <p>
            For defective or damaged products, please contact us at the contact
            details below to arrange a refund or exchange.
          </p>

          <p className="note">Please Note</p>

          <ul>
            <li>A 10% restocking fee will be charged for all returns.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>QUESTIONS</h2>
          <p>
            If you have any questions concerning our return policy, please
            contact us at:
          </p>

          <div className="contact-info">
            <p>0909090909</p>
            <p>hhqtv@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

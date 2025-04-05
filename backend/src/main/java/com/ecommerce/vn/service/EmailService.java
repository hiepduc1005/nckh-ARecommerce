package com.ecommerce.vn.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

@Service
public class EmailService {

	@Value("${spring.sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${sendgrid.sender.email}")
    private String senderEmail;

    public String sendOrderConfirmationEmail(String to, Map<String, String> data) {
        try {
            // Đọc template HTML
            String htmlContent = new String(Files.readAllBytes(Paths.get(new ClassPathResource("templates/order-confirmation.html").getURI())));

            // Thay thế dữ liệu vào template
            for (Map.Entry<String, String> entry : data.entrySet()) {
                htmlContent = htmlContent.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
            System.out.println(sendGridApiKey);
            System.out.println(senderEmail);
            System.out.println("TO: " + to);


            // Gửi email
            Email from = new Email(senderEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, "Xác nhận thanh toán đơn hàng", toEmail, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            System.out.println("SendGrid Response Code: " + response.getStatusCode());
            System.out.println("SendGrid Response Body: " + response.getBody());  // Xem lỗi chi tiết
            System.out.println("SendGrid Response Headers: " + response.getHeaders());
            return "Email sent successfully! Status Code: " + response.getStatusCode();
        } catch (IOException ex) {
            return "Error sending email: " + ex.getMessage();
        }
    }
    
    public void sendOtpEmail(String recipientEmail, String username, String otpCode) throws IOException {
        Email from = new Email(senderEmail);
        Email to = new Email(recipientEmail);
        String subject = "Xác nhận mã OTP của bạn";

        // Gọi hàm tạo HTML cho email
        String htmlContent = readHtmlTemplate("templates/forgot-password-otp-email.html");

        htmlContent = htmlContent.replace("{USERNAME}", username)
                                 .replace("{OTP_CODE}", otpCode);

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("Response Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());
        } catch (IOException ex) {
            throw new RuntimeException("Gửi email thất bại", ex);
        }
    }
    
    public void sendWelcomeEmail(String recipientEmail, String username) throws IOException {
        Email from = new Email(senderEmail);
        Email to = new Email(recipientEmail);
        String subject = "Chào mừng! Bạn đã sẵn sàng cho trải nghiệm mua sắm tương lai?";

        // Gọi hàm tạo HTML cho email
        String htmlContent = readHtmlTemplate("templates/welcome.html");

        htmlContent = htmlContent.replace("{USERNAME}", username);

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("Response Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());
        } catch (IOException ex) {
            throw new RuntimeException("Gửi email thất bại", ex);
        }
    }
    
    private String readHtmlTemplate(String filePath) throws IOException {
        ClassPathResource resource = new ClassPathResource(filePath);
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }
}

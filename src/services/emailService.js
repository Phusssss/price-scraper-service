import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Thay bằng email thật
    pass: 'your-app-password'     // Thay bằng app password
  }
});

export const sendPriceAlert = async (userEmail, alert, currentPrice) => {
  const subject = `🚨 Cảnh báo giá ${alert.productName}`;
  const html = `
    <h2>Cảnh báo giá nông sản</h2>
    <p><strong>Sản phẩm:</strong> ${alert.productName}</p>
    <p><strong>Thị trường:</strong> ${alert.market}</p>
    <p><strong>Giá hiện tại:</strong> ${currentPrice.toLocaleString()} đ/kg</p>
    <p><strong>Giá cảnh báo:</strong> ${alert.targetPrice.toLocaleString()} đ/kg</p>
    <p><strong>Loại cảnh báo:</strong> ${alert.alertType === 'above' ? 'Vượt quá' : 'Xuống dưới'}</p>
    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
  `;

  try {
    await transporter.sendMail({
      from: 'NôngLạc <your-email@gmail.com>',
      to: userEmail,
      subject,
      html
    });
    console.log(`Email alert sent to ${userEmail}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};
import { sendPushNotification } from './src/services/fcmService.js';

// Test FCM với fake data
const testAlert = {
  productName: 'Tiêu',
  market: 'Đắk Nông', 
  targetPrice: 150000,
  alertType: 'above'
};

const testFCMToken = 'PASTE_FCM_TOKEN_HERE'; // Lấy từ app Flutter

console.log('Testing FCM notification...');
sendPushNotification(testFCMToken, testAlert, 155000)
  .then(() => console.log('✅ Test completed'))
  .catch(err => console.error('❌ Test failed:', err));
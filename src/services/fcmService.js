import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin (cần service account key)
try {
  const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Firebase Admin not initialized - FCM disabled');
}

export const sendPushNotification = async (fcmToken, alert, currentPrice) => {
  console.log(`🔍 Checking FCM setup...`);
  console.log(`📱 FCM Token: ${fcmToken ? fcmToken.substring(0, 20) + '...' : 'MISSING'}`);
  console.log(`🔧 Firebase Admin apps: ${admin.apps.length}`);
  
  if (!admin.apps.length) {
    console.log('❌ Firebase Admin not initialized - no service account key');
    return;
  }

  const message = {
    token: fcmToken,
    notification: {
      title: `🚨 Cảnh báo giá ${alert.productName}`,
      body: alert.alertType === 'above'
        ? `${alert.productName} tại ${alert.market} đã vượt ${alert.targetPrice.toLocaleString()}đ`
        : `${alert.productName} tại ${alert.market} đã xuống dưới ${alert.targetPrice.toLocaleString()}đ`
    },
    data: {
      type: 'price_alert',
      productName: alert.productName,
      market: alert.market,
      currentPrice: currentPrice.toString()
    }
  };

  try {
    console.log(`📤 Sending FCM message...`);
    const response = await admin.messaging().send(message);
    console.log(`✅ Push notification sent successfully: ${response}`);
  } catch (error) {
    console.error('❌ FCM send error:', error.message);
    console.error('Full error:', error);
  }
};
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.checkPriceAlerts = functions.firestore
  .document('prices/{priceId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return;
    
    const newPrice = change.after.data();
    const db = admin.firestore();
    
    try {
      const alertsSnapshot = await db.collection('price_alerts')
        .where('isActive', '==', true)
        .get();
      
      const notifications = [];
      
      for (const alertDoc of alertsSnapshot.docs) {
        const alert = alertDoc.data();
        
        const matchesProduct = newPrice.productName.includes(alert.productName);
        const matchesMarket = newPrice.market === alert.market;
        
        if (matchesProduct && matchesMarket) {
          let shouldAlert = false;
          
          if (alert.alertType === 'above' && newPrice.currentPrice >= alert.targetPrice) {
            shouldAlert = true;
          } else if (alert.alertType === 'below' && newPrice.currentPrice <= alert.targetPrice) {
            shouldAlert = true;
          }
          
          if (shouldAlert) {
            const userDoc = await db.collection('users').doc(alert.userId).get();
            const fcmToken = userDoc.data()?.fcmToken;
            
            if (fcmToken) {
              const message = {
                token: fcmToken,
                notification: {
                  title: `Cảnh báo giá ${alert.productName}`,
                  body: alert.alertType === 'above'
                    ? `${alert.productName} tại ${alert.market} đã vượt ${alert.targetPrice.toLocaleString()}đ`
                    : `${alert.productName} tại ${alert.market} đã xuống dưới ${alert.targetPrice.toLocaleString()}đ`,
                },
              };
              
              notifications.push(message);
            }
          }
        }
      }
      
      if (notifications.length > 0) {
        await admin.messaging().sendAll(notifications);
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  });
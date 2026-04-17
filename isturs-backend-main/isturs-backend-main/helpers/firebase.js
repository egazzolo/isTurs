const admin = require('firebase-admin')
const serviceAccount = require('../firebase-service-account.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const sendPushNotification = async (fcmToken, title, body) => {
  if (!fcmToken) return
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
        },
      },
    })
  } catch (error) {
    console.error('Error sending push notification:', error)
  }
}

module.exports = { sendPushNotification }
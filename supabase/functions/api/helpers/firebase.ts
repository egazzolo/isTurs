// Sends push notifications through the FCM HTTP v1 API.
// firebase-admin does not run reliably on the Edge runtime, so this signs the
// service-account JWT with jose and exchanges it for an access token directly.
import { SignJWT, importPKCS8 } from 'npm:jose@5.2.4'

let cachedToken: { value: string; expiresAt: number } | null = null

const getAccessToken = async () => {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value
  }

  const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL')!
  const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')!.replace(/\\n/g, '\n')
  const key = await importPKCS8(privateKey, 'RS256')

  const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/firebase.messaging' })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key)

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`Google token error ${res.status}: ${await res.text()}`)

  const { access_token, expires_in } = await res.json()
  cachedToken = { value: access_token, expiresAt: Date.now() + expires_in * 1000 }
  return access_token as string
}

export const sendPushNotification = async (fcmToken: string, title: string, body: string) => {
  if (!fcmToken) return
  try {
    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
    const accessToken = await getAccessToken()
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,
          notification: { title, body },
          android: {
            priority: 'high',
            notification: { sound: 'default' },
          },
        },
      }),
    })
    if (!res.ok) throw new Error(`FCM error ${res.status}: ${await res.text()}`)
  } catch (error) {
    console.error('Error sending push notification:', error)
  }
}

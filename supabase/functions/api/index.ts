// ISTURS backend running as a Supabase Edge Function.
// Port of isturs-backend-main/ (Express on Railway). Supabase serves this
// function at /functions/v1/api, and the request path it receives starts
// with /api, so the original route prefixes are kept as-is.
import express from 'npm:express@4.19.2'
import cors from 'npm:cors@2.8.5'

import authRoutes from './routes/auth.ts'
import userRoutes from './routes/user.ts'
import translationRoutes from './routes/translation.ts'
import upholdRoutes from './routes/uphold.ts'
import chatsRoutes from './routes/chats.ts'

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'apikey', 'x-client-info', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override'],
  credentials: false
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/translation', translationRoutes)
app.use('/api/uphold', upholdRoutes)
app.use('/api/chats', chatsRoutes)

app.get('/api/health', (_req: any, res: any) => res.json({ ok: true }))

app.listen(8000)

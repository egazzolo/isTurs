const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server: IOServer } = require('socket.io')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      auth: '/api/auth',
      user: '/api/user',
      translation: '/api/translation',
      uphold: '/api/uphold',
      chats: '/api/chats',
    }

    this.middlewares()
    this.routes()

    this.server = http.createServer(this.app)
    this.io = new IOServer(this.server)
    this.sockets()
  }

  middlewares() {
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override'],
      credentials: false
    }))

    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }))
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.user, require('../routes/user'))
    this.app.use(this.paths.translation, require('../routes/translation'))
    this.app.use(this.paths.uphold, require('../routes/uphold'))
    this.app.use(this.paths.chats, require('../routes/chats'))
  }

  sockets() {
    this.io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado', socket.id)
      socket.on('disconnect', () => {
        console.log('Cliente desconectado')
      })
    })
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`)
    })
  }
}

module.exports = Server

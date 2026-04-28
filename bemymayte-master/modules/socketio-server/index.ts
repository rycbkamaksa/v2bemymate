import type { IChatOutPayload, IPlayerLeavePayload, ISearchCancelPayload, ISearchInitPayload } from './types/requests'
import type { Socket } from 'socket.io'
import { BASE_APP_HOST, BASE_APP_URL } from './consts/requests'

const { SocketRequests } = require('./types/requests')
const { default: handlers } = require('./runtime/handlers')
const { stdLogger } = require('./consts/logging')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const { createServer } = require('http')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://bemymate.ru'],
    credentials: true,
  }
})

const corsOpts = {
  origin: ['http://localhost:3000', 'https://bemymate.ru'],
}

app.use(cors(corsOpts))

io.on('connection', (socket: Socket) => {
  stdLogger.info(`Connected to socket-server from: ${socket.client.conn.remoteAddress}`)
  stdLogger.info(`Connections being held: ${io.engine.clientsCount}`)

  // TODO: we need to handle reconnection after page refresh

  socket.on(SocketRequests.SEARCH_INIT, (payload: Omit<ISearchInitPayload, 'socket'>) => {
    handlers[SocketRequests.SEARCH_INIT]({socket, ...payload}, io)
  })

  socket.on(SocketRequests.SEARCH_CANCEL, (payload: ISearchCancelPayload) => {
    handlers[SocketRequests.SEARCH_CANCEL](payload, io)
  })

  socket.on(SocketRequests.PLAYER_LEAVE, (payload: IPlayerLeavePayload) => {
    handlers[SocketRequests.PLAYER_LEAVE](payload, io)
  })

  socket.on(SocketRequests.CHAT_OUT, (payload: IChatOutPayload) => {
    handlers[SocketRequests.CHAT_OUT](payload, io)
  })
})

// handlers for testing only
if (process.env.NODE_ENV !== 'production') {
  app.post('/remove_participant', (req, res) => {
    const { guid } = req.query
    guid ? res.send({msg: 'accepted'}) : res.status(404).send({msg: 'guid query param is missing'})
    handlers[SocketRequests.SEARCH_CANCEL]({ guid }, io)
  })

  app.post('/send_msg', (req, res) => {
    // TODO: read body with payload
    const { guid } = req.query
    guid ? res.send({msg: 'accepted'}) : res.status(404).send({msg: 'guid query param is missing'})
    handlers[SocketRequests.CHAT_IN]({ guid }, io)
  })

  app.post('/:parentGuid/add_participant', (req, res) => {
    const { parentGuid } = req.params
    const { guid } = req.query
    guid ? res.send({msg: 'accepted'}) : res.status(404).send({msg: 'guid query param is missing'})
    handlers[SocketRequests.SEARCH_INIT]({ socket: parentGuid, guid }, io)
  })
}

// TODO: add port env vars
server.listen(5176, () => {
  console.log('\x1b[36mℹ', '\x1b[0mStarted socket-io server on port 5176')
})

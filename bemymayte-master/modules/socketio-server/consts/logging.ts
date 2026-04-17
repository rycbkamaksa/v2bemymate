import { format, transports, createLogger, addColors, level } from 'winston'
import { rooms, applicants } from '../runtime/sharedState'

export const COLORS = {
  guid: '\x1b[46m\x1b[33m',
  role: '\x1b[47m\x1b[35m',
  reset: '\x1b[0m',
  green: '\x1b[32m',
  info: '\x1b[0m\x1b[32m',
  room: '\x1b[45m\x1b[30m',
}

export enum LoggerCmds {
  Plain,
  SearchInit,
  PlayerAdd,
  RoomFull,
  Error,
}

addColors({
  guid: 'bold magentaBG cyan',
  role: 'bold cyanBG yellow',
  room: 'bold magentaBG black',
  appendix: 'bold yellowBG cyan',
})

const colorizer = format.colorize()
const prodColorizer = (level: string, content: string) => {
  return process.env.NODE_ENV === 'production' ? content : colorizer.colorize(level, content)
}

export interface ILoggerArgs {
  level: string,
  timestamp: string,
  cmd: LoggerCmds,
  message: string,
  guid?: string,
  role?: string,
  room?: string,
  players?: string[],
  err?: string | Error,
}

const stdFormat = format.printf((info) => {
  let formatted = `${info.timestamp} ${info.level}: `

  Object.entries(info as ILoggerArgs).forEach(([k, v]) => {
    if (k === 'level' || k === 'timestamp' || k === 'cmd' || k === 'message' || k === 'err') {
      return
    }

    if (k === 'players') {
      info.players = info.players.map((plGuid) => prodColorizer('guid', plGuid))
      return
    }

    info[k] = prodColorizer(k, v)
  })

  const {
    cmd = info.level === 'error' ? LoggerCmds.Error : LoggerCmds.Plain,
    message = '',
    guid = prodColorizer('guid', '?'),
    role = prodColorizer('guid', '?'),
    room = prodColorizer('guid', '?'),
    players = [],
    err = '',
  } = info as ILoggerArgs

  let msgContent = ''
  switch (cmd) {
    case LoggerCmds.Plain:
      formatted += message
      break
    case LoggerCmds.SearchInit:
      msgContent = `Initiating search for player ${guid} for role ${role}`
      break
    case LoggerCmds.PlayerAdd:
      msgContent = `Added ${guid} with role ${role} to room ${room}`
      break
    case LoggerCmds.RoomFull:
      msgContent = `Room ${room} is full; players: ${players}`
      break
    case LoggerCmds.Error:
      msgContent = `${message}: ${err}`
      break
    default:
      console.error('Unknown logger command')
  }

  formatted += prodColorizer(level, msgContent)
  formatted += '\n -- ' + prodColorizer('appendix', `[rooms: ${rooms.size} | applicants: ${applicants.size}]`)
  return formatted
})

const colorFormat = process.env.NODE_ENV !== 'production' ? format.colorize({ all: true }) : format.simple()

const stdLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss',
    }),
    colorFormat,
    stdFormat
  ),
  exitOnError: false,
  transports: [new transports.Console()],
})


if (process.env.NODE_ENV === 'production') {
  stdLogger.add(new transports.File({ filename: 'logs/search.log' }))
}

export {
  stdLogger,
}


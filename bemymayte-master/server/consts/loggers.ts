import { format, transports, createLogger, addColors } from 'winston'

// в целом, мы можем прикреплять attachedLogger к разным логгерам,
// каждый из которых может требовать своего выравнивания - задаем их тут
const ATTACHED_LOGGER_PADDINGS = {
  'std': '\t\t\t',
}

addColors({ request: 'bold cyan magentaBG' })
const colorizer = format.colorize()

const stdFormat = format.printf(({ level, timestamp, message, method }) =>
  process.env.NODE_ENV === 'production' ?
    `${timestamp} ${level}: ${method ? method : ''} ${message}` :
    `${timestamp} ${level}: ${colorizer.colorize('request', method ? method : '')} ${message}`)

const attachedFormat = format.printf(({ message, attachedTo = 'std' }) => {
    const separator = ATTACHED_LOGGER_PADDINGS[attachedTo]
    return `${separator}|\n${separator}|___ ${message}`
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

const attachedLogger = createLogger({
  level: 'silly',
  format: format.combine(colorFormat, attachedFormat),
  transports: [new transports.Console()],
})

if (process.env.NODE_ENV === 'production') {
  stdLogger.add(new transports.File({ filename: 'logs/restAPI.log' }))
  attachedLogger.add(new transports.File({ filename: 'logs/restAPI.log' }))
}

// по мере разработки сюда можно будет добавить новых логгеров
// для других уровней (предупреждения, ошибки)

export {
  stdLogger,
  attachedLogger,
}

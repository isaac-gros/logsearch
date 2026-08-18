type Log = {
  timestamp: Date,
  message: string,
  service: string,
  level: LogLevel
}

type ServerLogsPayload = {
  total: number,
  data: LogPayload[]
}

type LogPayload = {
  timestamp: string,
  level: LogLevel
  message: string,
  service: string,
}

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

export type { Log, LogPayload, ServerLogsPayload, LogLevel }
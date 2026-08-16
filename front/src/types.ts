type Log = {
  timestamp: Date,
  message: string,
  service: string,
  level: LogLevel
}

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

export type { Log, LogLevel }
// Un log dont le format est identique au serveur
type Log = {
  timestamp: Date,
  message: string,
  service: string,
  level: LogLevel
}

// Query parameters pour la recherche de logs
type LogsSearchParams = {
  query?: string,
  level?: string,
  service?: string,
  page?: number,
}

// Réponse du serveur dans le cas d'un renvoi de logs OK
type ServerLogsPayload = {
  total: number,
  data: LogPayload[]
}

// Données brutes dans la réponse OK du serveur
type LogPayload = {
  timestamp: string,
  level: LogLevel
  message: string,
  service: string,
}

// Niveaux de logs
type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

export type { Log, LogsSearchParams, LogPayload, ServerLogsPayload, LogLevel }
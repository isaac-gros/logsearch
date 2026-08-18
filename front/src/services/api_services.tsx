import axios from 'axios';
import type { ServerLogsPayload } from '../types';

type GET_LogSearchParams = {
  query?: string,
  level?: string,
  service?: string
}

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL

export const apiService = {

  /**
   * GET /logs/search - Récupération des logs serveurs 
   */
  getLogs: ({query, level, service }: GET_LogSearchParams) => {
    return axios.get<ServerLogsPayload>(`${apiBaseUrl}/logs/search`)
  }
}
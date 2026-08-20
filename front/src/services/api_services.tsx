import axios, { type AxiosResponse } from 'axios';
import type { Log, LogsSearchParams, ServerLogsPayload } from '../types';

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL

export const apiService = {

  /**
   * GET /logs/search - Récupération des logs serveurs 
   * @param {LogsSearchParams} : Un objet contenant les query params de l'utilisateur
   * @returns {Promise<AxiosResponse>} : Une promise (réponse) de la requête Axios
   */
  getLogs: ({query, level, service, page }: LogsSearchParams): Promise<AxiosResponse> => {
    return axios.get<ServerLogsPayload>(`${apiBaseUrl}/logs/search`, {
      params: {
        q: query,
        level: level,
        service: service,
        page: page
      }
    })
  },

  /**
   * POST /logs
   * @param {Log} payload : Corps de la requête, doit être un log valide
   * @returns {Promise<AxiosResponse>} : Une promise (réponse) de la requête Axios
   */
  createLog: (payload: Log): Promise<AxiosResponse> => {
    return axios.post(`${apiBaseUrl}/logs`, payload)
  }
}
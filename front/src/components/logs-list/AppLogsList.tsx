import { act, useEffect, useState, type BaseSyntheticEvent, type Dispatch, type SetStateAction } from "react";
import { type LogPayload, type LogsSearchParams, type ServerLogsPayload } from "../../types";
import { type Log } from "../../types";
import { apiService } from "../../services/api_services";
import AppLogsListRow from "./AppLogsListRow";
import AppPendingLogsList from "./AppPendingLogsList";

interface AppLogsListProps {
  userQueryState: LogsSearchParams;
  setUserQueryState: Dispatch<SetStateAction<LogsSearchParams>>
}

/**
 * Tableau des logs
 */
function AppLogsList({
  userQueryState,
  setUserQueryState
}: AppLogsListProps) {
  const [logsData, setLogsData] = useState<Log[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // Sérialisation pour garantir une comparaison par valeur et non par référence
  const queryParamsKey = JSON.stringify(userQueryState)

  // On requête les logs au chargement et à chaque mise à jour du refetchTrigger
  useEffect(() => {
    let isCancelled = false;

    // Requête vers l'API encapsulée avec async
    const fetchLogs = async () => {
      setLoading(true)
      setErrorMessage("")

      try {
        const res = await apiService.getLogs(userQueryState)
        if (isCancelled) return;

        // Si la réponse est OK, on met à jour l'état
        if (res.status === 200) {
          const payload: ServerLogsPayload = res.data;

          // S'il n'y a aucune donnée, on affiche un message
          if (payload.data.length === 0) {
            setErrorMessage("Aucune donnée à afficher")
            setLogsData([])
            setTotalItems(0)
            return;
          }

          // On ajoute les logs dans le state
          const logs: Log[] = payload.data.map((item: LogPayload) => ({
            timestamp: new Date(item.timestamp),
            level: item.level,
            message: item.message,
            service: item.service,
          }))
          
          setTotalItems(payload.total)
          setLogsData(logs)
        } else {
          setErrorMessage(`Une erreur est survenue (Erreur ${res.status}).`)
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorMessage(`Une erreur inattendue est survenue : ${String(err)}`)
        }
      } finally {
        if (!isCancelled) setLoading(false)
        setActivePage(1)
      }
    };
    fetchLogs()

    // Fonction de cleanup (évite de déclencher le useEffect de façon indésirable)
    return () => {
      isCancelled = true;
    };
  }, [userQueryState, queryParamsKey, refetchTrigger])

  // Permet de relancer la requête API
  const refreshLogs = () => {
    setRefetchTrigger((prev) => prev + 1)
  };

  // Fonctions de paginations
  const getMaxPageNumber = () => {
    return Math.ceil(totalItems / 20)
  }

  // Changement du numéro de page
  const handleNavButton = (dir: "prev" | "next") => {
    const nextValue = (dir == "next") ? 1 : -1
    setActivePage(activePage + nextValue)
    setUserQueryState({
      ...userQueryState,
      page: activePage
    })
    refreshLogs()
  }

  return (
    <section id="logs-list" className="m-0 px-4 my-6">
      <div className="frame flex-col relative">
        <table className="w-full text-left p-2 mb-5">
          <colgroup>
            <col span={1} width={"20%"}></col>
            <col span={1} width={"20%"}></col>
            <col span={2} width={"40%"}></col>
            <col span={1} width={"20%"}></col>
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Niveau</th>
              <th>Message</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            {/* "Squelette" de visualisation des logs */}
            <AppPendingLogsList isHidden={!isLoading}></AppPendingLogsList>

            {/* Affichage des logs */}
            {logsData.length > 0 ? (
              logsData.map((logItem, logKey) => (
                <AppLogsListRow
                  logItem={logItem}
                  key={logKey}
                  entryKey={logKey}
                ></AppLogsListRow>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  <p className="py-2">{!isLoading ? errorMessage : ""}</p>
                </td>
              </tr>
            )}

            {/* Affichage d'un bouton pour rafraîchir la liste */}
            {!isLoading && errorMessage !== '' ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <a
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => refreshLogs()}
                  >
                    Actualiser
                  </a>
                </td>
              </tr>
            ) : (
              <></>
            )}
          </tbody>
        </table>

        {/* Navigation et nombre total d'éléments */}
        {totalItems > 0 ? 
        <div className="flex justify-center w-full pb-2 pt-1 mb-2 sticky bottom-0" id="logs-list-pagination">
          <div className="flex flex-col justify-center items-center gap-3">
            <p>{totalItems} éléments</p>
            <div className="flex items-center gap-6">
              <button 
                type="button" 
                className="app-button" 
                disabled={activePage == 1}
                onClick={() => handleNavButton("prev")}>‹</button>
              <div className="flex items-center">
                <input 
                  readOnly={true}
                  value={activePage}
                  type="text" 
                  className="app-input inline-flex w-10"
                />
                <p>/{getMaxPageNumber()}</p>
              </div>
              <button 
                type="button" 
                className="app-button" 
                disabled={getMaxPageNumber() == activePage}
                onClick={() => handleNavButton("next")}
              >›</button>
            </div>
          </div>
        </div>
        : <></>}
      </div>
    </section>
  )
}

export default AppLogsList;

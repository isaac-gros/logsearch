import { useEffect, useState } from "react";
import { type ServerLogsPayload, type LogPayload } from "../../types";
import { type Log } from "../../types";
import { apiService } from "../../services/api_services";
import AppLogsListRow from "./AppLogsListRow";
import AppPendingLogsList from "./AppPendingLogsList";

/**
 * Tableau des logs
 */
function AppLogsList() {
  const [logsData, setLogsData] = useState<Log[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (logsData.length == 0 && isLoading) {
      apiService
        .getLogs({})
        .then((res) => {
          // En cas de succès, on met à jour le state des données (logsData)
          if (res.status == 200) {
            const payload = res.data;

            // Si aucun log n'a été trouvé, on affiche un message
            if (payload.data.length == 0) {
              setErrorMessage("Aucune donnée à afficher");
              return;
            }

            // Sinon, on traite chaque élément en tant que Log
            const logs: Log[] = []
            payload.data.forEach((item: LogPayload) => {
              logs.push({
                timestamp: new Date(item.timestamp),
                level: item.level,
                message: item.message,
                service: item.service,
              });
            });
            setLogsData(logs);
          } else {
            // Pour tout autre erreur, on affiche un message avec le statut HTTP
            setErrorMessage(`Une erreur est survenue (Erreur ${res.status}).`);
            console.error(res.data);
          }
        })
        .catch((err) => {
          // On affiche un message en cas d'erreur
          setErrorMessage(
            `Une erreur inattendue est survenue : ${err.toString()}`,
          );
        })
        .finally(() => {
          // On finit le chargement
          setLoading(false);
        });
    }
  }, [logsData, setLogsData, isLoading, setLoading]);

  // Fonction permettant de relancer la recherche
  const refreshLogsList = () => {
    setLogsData([]);
    setLoading(true);
  };

  return (
    <section id="logs-list" className="m-0 px-4 my-6">
      <div className="frame">
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
            {/* Squelette de visualiser */}
            <AppPendingLogsList isHidden={!isLoading}></AppPendingLogsList>

            {/* Affichage des logs */}
            {logsData.length > 0 ? (
              logsData.map((logItem, logKey) => (
                <AppLogsListRow
                  logItem={logItem}
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
            {!isLoading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <a
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => refreshLogsList()}
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
      </div>
    </section>
  );
}

export default AppLogsList;

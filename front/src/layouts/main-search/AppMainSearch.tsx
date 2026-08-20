import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { LogLevel, LogsSearchParams } from "../../types";
import AppSearchLogsForm from "../../components/log-form/AppSearchLogsForm";
import AppCreateLogForm from "../../components/log-form/AppCreateLogForm";

interface AppMainSearchProps {
  // Récupération de la fonction de mise à jour du state parent (userQuery)
  setUserQueryState: Dispatch<SetStateAction<LogsSearchParams>>;
}

/**
 * Formulaire de recherche et de création de logs 
 */
function AppMainSearch({ setUserQueryState }: AppMainSearchProps) {
  const logsLevel: LogLevel[] = ["INFO", "WARNING", "ERROR", "DEBUG"];

  // On conserve en état les paramètres de recherche tant que
  // l'utilisateur n'a pas cliqué sur le bouton "Search"
  const [queryPayload, setQueryPayload] = useState<LogsSearchParams>({});
  const [showNewLogForm, setShowNewLogForm] = useState(false);

  const toggleLogForm = () => setShowNewLogForm(!showNewLogForm);
  const displayTitle = () => {
    return showNewLogForm
      ? "Ajouter un élément de log"
      : "Explorer les logs de vos services";
  };

  useEffect(() => {
    setUserQueryState(queryPayload)
  }, [setUserQueryState, queryPayload])

  return (
    <main className="m-0 px-4 mt-14">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl my-6">{displayTitle()}</h1>
        <div className="inline-flex">
          <button
            className={"app-button " + (showNewLogForm ? "error" : "")}
            type="button"
            onClick={() => toggleLogForm()}
          >
            {!showNewLogForm ? "+ Ajouter un log" : "× Annuler"}
          </button>
        </div>
      </div>

      <div className="frame">
        {showNewLogForm ? (
          <AppCreateLogForm
            setNewQueryState={setQueryPayload}
            logLevels={logsLevel}
          ></AppCreateLogForm>
        ) : (
          <AppSearchLogsForm
            queryPayloadState={queryPayload}
            setQueryPayloadState={setQueryPayload}
            logLevels={logsLevel}
          ></AppSearchLogsForm>
        )}
      </div>
    </main>
  );
}

export default AppMainSearch;

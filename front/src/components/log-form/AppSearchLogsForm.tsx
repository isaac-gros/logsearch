import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { LogLevel, LogsSearchParams } from "../../types";

interface AppSearchLogsFormProps {
  queryPayloadState: LogsSearchParams
  setQueryPayloadState: Dispatch<SetStateAction<LogsSearchParams>>
  logLevels: LogLevel[]
}

/**
 * Formulaire de recherche de logs
 */
function AppSearchLogsForm({
  queryPayloadState,
  setQueryPayloadState,
  logLevels
}: AppSearchLogsFormProps) {

  const [logQueryFormData, setLogQueryFormData] = useState<LogsSearchParams>({})

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Récupération des noms des champs et de leurs valeurs
    const { name, value } = event.target;

    // On retire le champ dont la valeur est vide, dans l'objet "queryPayload"
    if (value == "") {
      const payloadEntries = Object.entries(queryPayloadState);
      const updatedPayload = Object.fromEntries(
        payloadEntries.filter(([key]) => key !== name),
      );
      setLogQueryFormData(updatedPayload);
    } else {
      // Sinon, on l'ajoute au reste de l'objet
      setLogQueryFormData({
        ...queryPayloadState,
        [event.target.name]: event.target.value,
      });
    }
  };

  // Mise à jour du state parent userQuery
  const handleFormSubmit = () => {
    setQueryPayloadState(logQueryFormData);
  };

  // Permet de soumettre le forumaire lorsque la touche
  // "Entrée" est appuyée
  const handleKeyDown = (eventKey: KeyboardEvent["key"]) => {
    if (eventKey === "Enter") {
      handleFormSubmit();
    }
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 w-full p-8"
      onKeyDown={(e) => handleKeyDown(e.key)}
    >
      {/* Mot clef à chercher */}
      <div className="col-span-4 app-form-field">
        <label htmlFor="logs-message-query" className="p-1">
          Que recherchez-vous ?
        </label>
        <input
          type="text"
          id="logs-message-query"
          placeholder="Mot clef dans les messages de logs : API, User, etc."
          className="app-input"
          name="query"
          onChange={(e) => handleFieldChange(e)}
        />
      </div>

      {/* Filtre par niveau */}
      <div className="col-span-3 app-form-field">
        <label htmlFor="logs-level" className="p-1">
          Niveau du log
        </label>
        <select
          id="logs-level"
          className="app-input"
          name="level"
          onChange={(e) => handleFieldChange(e)}
        >
          <option value="">--</option>
          {logLevels.map((level, key) => (
            <option value={level} key={key}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par service */}
      <div className="col-span-3 app-form-field">
        <label htmlFor="logs-service" className="p-1">
          Service
        </label>
        <input
          type="text"
          id="logs-service"
          className="app-input"
          name="service"
          onChange={(e) => handleFieldChange(e)}
          onKeyDown={(e) => handleKeyDown(e.key)}
          placeholder="api-gateway, frontend-portal, etc."
        />
      </div>

      {/* Bouton de recherche */}
      <div className="col-span-2 flex flex-col self-end">
        <button
          type="button"
          className="app-button"
          onClick={() => handleFormSubmit()}
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}

export default AppSearchLogsForm;

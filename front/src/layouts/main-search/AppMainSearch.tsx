import { useState, type ChangeEvent, type Dispatch, type KeyboardEvent, type SetStateAction } from "react";
import type { LogsSearchParams } from "../../types";

interface AppMainSearchProps {

  // Récupération de la fonction de mise à jour du state parent (userQuery)
  setUserQueryState: Dispatch<SetStateAction<LogsSearchParams>>;
}

function AppMainSearch({
  setUserQueryState
}: AppMainSearchProps) {
  const logsLevel = ["INFO", "WARNING", "ERROR", "DEBUG"];
  
  // On conserve en état les paramètres de recherche tant que
  // l'utilisateur n'a pas cliqué sur le bouton "Search"
  const [queryPayload, setQueryPayload] = useState<LogsSearchParams>({})

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {

    // Récupération des noms des champs et de leurs valeurs
    const { name, value } = event.target

    // On retire le champ dont la valeur est vide, dans l'objet "queryPayload"
    if (value == "") { 
      const payloadEntries = Object.entries(queryPayload)
      const updatedPayload = Object.fromEntries(payloadEntries.filter(([key]) => key !== name))
      setQueryPayload(updatedPayload)
    } else {

      // Sinon, on l'ajoute au reste de l'objet
      setQueryPayload({
        ...queryPayload,
        [event.target.name]: event.target.value,
      })
    }
  };

  // Mise à jour du state parent userQuery
  const handleFormSubmit = () => {
    setUserQueryState(queryPayload)
  }

  // Permet de soumettre le forumaire lorsque la touche
  // "Entrée" est appuyée
  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleFormSubmit()
    }
  }

  return (
    <main className="m-0 px-4 mt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl my-6">Explorer les logs de vos services</h1>
        <div className="inline-flex">
          <button className="app-button">+ Ajouter des logs</button>
        </div>
      </div>

      <div className="frame">
        <form className="grid grid-cols-12 gap-4 w-full p-8" onKeyDown={(e) => handleKeyDown(e)}>
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
              {logsLevel.map((level, key) => (
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
              onKeyDown={(e) => handleKeyDown(e)}
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
      </div>
    </main>
  );
}

export default AppMainSearch;

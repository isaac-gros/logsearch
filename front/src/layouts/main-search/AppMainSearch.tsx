import './AppMainSearch.css';

function AppMainSearch() {
  const logsLevel = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl my-6">Explorer les logs de vos services</h1>
        <div className="inline-flex">
          <button className="app-button">+ Ajouter des logs</button>
        </div>
      </div>

      <div className="frame">
        <form className="grid grid-cols-12 gap-4 w-full p-8">

          {/* Mot clef à chercher */}
          <div className="col-span-4 app-form-field">
            <label htmlFor="logs-message-query" className="p-1">Que recherchez-vous ?</label>
            <input 
              className="app-input"
              id="logs-message-query"
              type="text" 
              placeholder="Mot clef dans les messages de logs : API, User, etc."
            />
          </div>

          {/* Filtre par niveau */}
          <div className="col-span-3 app-form-field">
            <label htmlFor="logs-level" className="p-1">Niveau du log</label>
            <select id="logs-level" className="app-input">
              <option value="">--</option>
              {logsLevel.map(level => (
                <option value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Filtre par service */}
          <div className="col-span-3 app-form-field">
            <label htmlFor="logs-message-query" className="p-1">Service</label>
            <input 
              className="app-input"
              id="logs-message-query"
              type="text" 
              placeholder="api-gateway, frontend-portal, etc."
            />
          </div>

          {/* Bouton de recherche */}
          <div className="col-span-2 flex flex-col self-end">
            <button type="submit" className="app-button">Rechercher</button>
          </div>

        </form>
      </div>
    </main>
  )
} 

export default AppMainSearch;
import AppHeader from "./layouts/header/AppHeader"
import AppLogsList from "./components/logs-list/AppLogsList"
import AppMainSearch from "./layouts/main-search/AppMainSearch"
import { useState } from "react"
import type { LogsSearchParams } from "./types"

function App() {

  // Stockage des query params de recherche de l'utilisateur
  const [userQuery, setUserQuery] = useState<LogsSearchParams>({ page: 1 })

  return (
    <>
      <AppHeader></AppHeader>
      
      {/* Barre de recherche principale */}
      <AppMainSearch setUserQueryState={setUserQuery}></AppMainSearch>

      {/* Liste des logs */}
      <AppLogsList setUserQueryState={setUserQuery} userQueryState={userQuery}></AppLogsList>
    </>
  )
}

export default App

import AppHeader from "./layouts/header/AppHeader"
import AppLogsList from "./components/logs-list/AppLogsList"
import AppMainSearch from "./layouts/main-search/AppMainSearch"

function App() {

  return (
    <>
      <AppHeader></AppHeader>
      <AppMainSearch></AppMainSearch>
      <AppLogsList></AppLogsList>
    </>
  )
}

export default App

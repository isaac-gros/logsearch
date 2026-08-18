interface AppPendingLogsList {
  isHidden: boolean
}

/**
 * Génère une vue "placeholder" 
 * pendant le chargement des données 
 */
function AppPendingLogsList({isHidden}: AppPendingLogsList) {
  const loadingTableRows = []
  while (loadingTableRows.length < 20) {
    const columns = [0,1,2,3];
    const rowId = loadingTableRows.length.toString()
    loadingTableRows.push(
      <tr key={rowId}>
        {columns.map((_, key) => (
          <td key={rowId + key}>
            <span className="loading-data-text"></span>
          </td>
        ))}
      </tr>
    )
  }

  return (
    <>{isHidden ? <></> : loadingTableRows}</>
  )
}

export default AppPendingLogsList
import type { Log } from "../../types"

interface AppLogsListRowProps {
  entryKey: number,
  logItem: Log
}

/**
 * Génère une ligne de logs dans le tableau de AppLogsList 
 */
function AppLogsListRow({entryKey, logItem}: AppLogsListRowProps) {

  // Classe CSS pour alterner les couleurs de ligne
  const rowClassName = entryKey % 2 == 0 ? 'row-even' : ''

  // Conversion en chaîne de chaque valeurs du log
  const logValues = Object.values(logItem).map(item =>
    (item instanceof Date) ? item.toISOString() : item.toString()
  )

  return (
    <tr>
      {logValues.map((logValue, dataKey) => (
        <td key={`${entryKey}${dataKey}`} className={rowClassName}>{logValue}</td>
      ))}
    </tr>
  )
}

export default AppLogsListRow
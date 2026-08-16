import { useState } from "react";
import { type LogLevel } from "../../types";
import { type Log } from "../../types";

function AppLogsList() {
  const [isLoading, setLoading] = useState(true)
  const loadingTableRows = generateLoadingTableRows()
  const sampleDataRows = generateDataRows(generateSampleData())

  setTimeout(() => setLoading(false), 1500)

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
            <th>Date</th>
            <th>Niveau</th>
            <th>Message</th>
            <th>Service</th>
          </thead>
          <tbody>
            {isLoading 
              ? loadingTableRows.map(item => item)
              : sampleDataRows.map(item => item)
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}

/**
 * Génère une vue "placeholder" 
 * pendant le chargement des données
 * @returns {React.JSX.Element[]} Une arborescence HTML 
 */
function generateLoadingTableRows() {
  const loadingTableRows = []
  while (loadingTableRows.length < 20) {
    const columns = [0,1,2,3];
    const rowId = loadingTableRows.length.toString()
    loadingTableRows.push(
      <tr key={loadingTableRows.length.toString()}>
        {columns.map((_, key) => (
          <td key={rowId + key}>
            <span className="loading-data-text"></span>
          </td>
        ))}
      </tr>
    )
  }
  return loadingTableRows
}

/**
 * Foncion permettant de générer de faux logs
 * @param {Log[]} data : Logs à implémenter 
 * @returns {React.JSX.Element[]} Une arborescence HTML 
 */
function generateDataRows(data: Log[]) {
  const tableRows = []
  for (let i = 0; i < data.length; i++) {
    const logItem = data[i]
    const logData = [
      logItem.timestamp.toISOString(), 
      logItem.level, 
      logItem.message, 
      logItem.service
    ]
    tableRows.push(
      <tr key={i}>
        {logData.map((value, key) => (
          <td key={i + key} className={i % 2 == 0 ? 'row-even' : ''}>{value}</td>
        ))}
      </tr>
    )
  }
  return tableRows;
}

/**
 * Génère de fausse données de logs
 * @returns {Log[]} - Des logs factices
 */
function generateSampleData() {
  const ids = ["a1e2f3", "b4c5d6", "e1d2b3", "f4a5c6"];
  const logsLevel: LogLevel[] = ["INFO", "WARNING", "ERROR", "DEBUG"];
  const services = ["api-gateway","frontend-portal","payment-service","debugger"];
  const messages = [
    "Service _ successfully processed",
    "Request _ timed out",
    "Invalid credentials for user _",
    "Debugging value : _",
  ];

  const sampleData = [];
  for (let i = 0; i < 20; i++) {
    const randDate = Math.floor(Math.random() * 7) * (24 * 60)
    const randomId = ids[i % 4];
    const randomDateCalculated = new Date().getTime() - randDate;
    sampleData.push({
      timestamp: new Date(randomDateCalculated),
      level: logsLevel[i % 4],
      message: messages[i % 4].replace('_', randomId),
      service: services[i % 4],
    })
  }
  return sampleData;
}

export default AppLogsList;

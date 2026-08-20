import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Log, LogLevel, LogPayload, LogsSearchParams } from "../../types";
import { apiService } from "../../services/api_services";

interface AppCreateLogFormProps {
  setNewQueryState: Dispatch<SetStateAction<LogsSearchParams>>;
  logLevels: LogLevel[];
}

function AppCreateLogForm({
  setNewQueryState,
  logLevels,
}: AppCreateLogFormProps) {
  // Création d'un Log par défaut au chargement
  const defaultLogObject = {
    timestamp: new Date(),
    message: "",
    level: logLevels[0],
    service: "",
  };

  // Modification du log par défaut
  // afin d'afficher une date lisible dans le formulaire
  const defaultLogPayload = Object.assign({
    ...defaultLogObject,
    ["timestamp"]: new Date().toISOString().slice(0, 19),
  });

  const [newLogFormData, setNewLogFormData] =
    useState<LogPayload>(defaultLogPayload);
  const [formDisabled, setFormDisabled] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    // Récupération des noms des champs et de leurs valeurs
    const { name, value } = event.target;
    setNewLogFormData({
      ...newLogFormData,
      [name]: value,
    });

    // On réinitialise le messages d'info
    setInfoMessage("");
  };

  // Permet de soumettre le forumaire lorsque la touche
  // "Entrée" est appuyée
  const handleKeyDown = (eventKey: KeyboardEvent["key"]) => {
    if (eventKey === "Enter") {
      handleFormSubmit();
    }
  };

  // Mise à jour du state parent userQuery
  const handleFormSubmit = async () => {
    try {
      if (formDisabled) return;

      // On convertit et vérifie des données du formulaire
      const logData = serializeAndValidateForm();
      if (logData == null) return; // Stop si le formulaire est invalide

      // On désactivate le formulaire pendant l'envoi
      setFormDisabled(true);

      // On envoie la requête et on vérifie le statut
      const res = await apiService.createLog(logData);
      if (res.status === 201) {
        setInfoMessage("Log ajouté avec succès.");
        setNewQueryState({});
      } else {
        setInfoMessage(
          `Une erreur est survenue lors de l'envoi du log (erreur ${res.status})`,
        );
        console.error("An error occured after sending log data", res.data);
      }
    } catch (error) {
      setInfoMessage(
        `Une erreur est survenue lors du traitement de la requête : ${String(error)}`,
      );
      console.error("Unexpected error occured during form submitting", error);
    } finally {
      setFormDisabled(false);
    }
  };

  // On vérifie les données du formulaires
  // et on convertit dans un nouvel objet Log les données
  const serializeAndValidateForm = (): Log | null => {
    const newLogObject: Log = {
      timestamp: new Date(newLogFormData["timestamp"]),
      level: newLogFormData["level"],
      message: newLogFormData["message"],
      service: newLogFormData["service"],
    };

    const logValidations = {
      timestamp: newLogObject.timestamp.toString() !== "Invalid Date",
      level: logLevels.includes(newLogObject.level),
      message: newLogObject.message !== "",
      service: newLogObject.service !== "",
    };

    const formErrors: string[] = [];
    Object.entries(logValidations).forEach(([key, isValid]) => {
      if (!isValid) formErrors.push(key);
    });

    if (formErrors.length > 0) {
      setInfoMessage(
        "Le formulaire contient des erreurs, le(s) champ(s) suivants sont requis : " +
          formErrors.join(", "),
      );
      return null;
    }

    return newLogObject;
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 w-full p-8"
      onKeyDown={(e) => handleKeyDown(e.key)}
    >
      {/* Message d'erreur */}
      {infoMessage == "" ? (
        <></>
      ) : (
        <div className="my-2 col-span-12 font-bold">{infoMessage}</div>
      )}

      {/* 1ere colonne: Date et message du log */}
      <div className="flex flex-col gap-4 flex-wrap col-span-5 justify-between">
        {/* Date du log */}
        <div className="w-full app-form-field">
          <label htmlFor="new-log-timestamp" className="p-1 mandatory">
            Date de création du log (Heure locale)
          </label>
          <input
            disabled={formDisabled}
            type="datetime-local"
            id="new-log-timestamp"
            className="app-input"
            name="timestamp"
            required={true}
            step={1}
            value={newLogFormData.timestamp}
            onChange={(e) => handleFieldChange(e)}
          />
        </div>

        {/* Niveau du log */}
        <div className="w-full app-form-field">
          <label htmlFor="logs-level" className="p-1 mandatory">
            Niveau du log
          </label>
          <select
            disabled={formDisabled}
            id="logs-level"
            className="app-input"
            name="level"
            required={true}
            value={newLogFormData.level}
            onChange={(e) => handleFieldChange(e)}
          >
            {logLevels.map((level, key) => (
              <option value={level} key={key}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-wrap col-span-5">
        {/* Message du log */}
        <div className="w-full grow app-form-field">
          <label htmlFor="new-log-message" className="p-1 mandatory">
            Message du log
          </label>
          <textarea
            disabled={formDisabled}
            id="new-log-message"
            placeholder="Indiquer ici le message du log"
            className="app-input"
            rows={1}
            name="message"
            required={true}
            value={newLogFormData.message}
            onChange={(e) => handleFieldChange(e)}
          />
        </div>

        {/* Service */}
        <div className="w-full grow app-form-field">
          <label htmlFor="logs-service" className="p-1 mandatory">
            Service
          </label>
          <input
            disabled={formDisabled}
            type="text"
            id="logs-service"
            className="app-input"
            name="service"
            required={true}
            value={newLogFormData.service}
            onChange={(e) => handleFieldChange(e)}
            onKeyDown={(e) => handleKeyDown(e.key)}
            placeholder="api-gateway, frontend-portal, etc."
          />
        </div>
      </div>

      {/* Bouton de recherche */}
      <div className="col-span-2 flex flex-col self-baseline">
        <button
          disabled={formDisabled}
          type="button"
          className="app-button mt-8.5"
          onClick={() => handleFormSubmit()}
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}

export default AppCreateLogForm;

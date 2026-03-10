/**
 * Campo input con label e gestione errore.
 *
 * Props:
 *  - label: string — etichetta sopra l'input
 *  - value: string — valore controllato
 *  - onChange: (e) => void — handler di modifica
 *  - placeholder: string — testo placeholder (opzionale)
 *  - type: string — tipo input HTML (default: "text")
 *  - error: string — messaggio di errore (opzionale)
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
}) {
  return (
    <fieldset className="fieldset">
      {label && (
        <legend className="fieldset-legend">{label}</legend>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input w-full ${error ? "input-error" : ""}`}
      />
      {error && (
        <p className="fieldset-label text-error">{error}</p>
      )}
    </fieldset>
  );
}

import cn from "@/utils/cn";

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
 *  - disabled: boolean — campo disabilitato (passa readOnly automaticamente)
 *  - ...rest — tutte le altre prop native dell'input
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  disabled = false,
  ...rest
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
        disabled={disabled}
        // Se disabled senza onChange, aggiungi readOnly per evitare warning React
        readOnly={disabled && !onChange}
        className={cn("input w-full", error && "input-error", disabled && "opacity-60 cursor-not-allowed")}
        {...rest}
      />
      {error && (
        <p className="fieldset-label text-error">{error}</p>
      )}
    </fieldset>
  );
}

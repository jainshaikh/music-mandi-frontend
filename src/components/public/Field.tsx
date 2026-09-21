import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  full?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Field({
  label,
  name,
  type = "text",
  required = false,
  helper,
  error = "Check this field.",
  full = false,
  placeholder,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className={cn("field", full && "full")}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {helper ? <span className="helper">{helper}</span> : null}
      <span className="error">{error}</span>
    </div>
  );
}

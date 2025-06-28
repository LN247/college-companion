import React, { useState } from "react";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // or use any eye icon you prefer

const InputWithError = React.memo(
  ({
    id,
    name,
    label,
    value,
    onChange,
    error,
    type,
    placeholder,
    min,
    icon: Icon,
    ...rest
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="input-with-error">
        <Label htmlFor={id} className="input-label">
          {Icon && <Icon className="input-icon" />}
          {label}
        </Label>
        <div className="input-container" style={{ position: "relative" }}>
          <Input
            id={id}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className="input-field-1"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />
          {isPassword && (
            <span
              className="toggle-password"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 2,
              }}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="error-message">
            <span className="error-icon" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default InputWithError;

import React from "react";
import "../Styles/plan.css";
// Memoized TableCellInput component
const TableCellInput = React.memo(
  ({ label, value, onChange, error, type = "text", min }) => {
    return (
      <div className="table-cell-input">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          className={`table-input ${error ? "input-error" : ""}`}
          aria-label={`Edit ${label}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {error && (
          <span id={`${label}-error`} className="table-error">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default TableCellInput;

import React from "react";
import { cn } from "../../lib/utils";
import "./Table.css";

const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <div className="table-container">
      <table ref={ref} className={cn("table", className)} {...props} />
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef(function TableHeader(
  { className, ...props },
  ref
) {
  return (
    <thead ref={ref} className={cn("table-header", className)} {...props} />
  );
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(function TableBody(
  { className, ...props },
  ref
) {
  return <tbody ref={ref} className={cn("table-body", className)} {...props} />;
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(function TableFooter(
  { className, ...props },
  ref
) {
  return (
    <tfoot ref={ref} className={cn("table-footer", className)} {...props} />
  );
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(function TableRow(
  { className, ...props },
  ref
) {
  return <tr ref={ref} className={cn("table-row", className)} {...props} />;
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(function TableHead(
  { className, ...props },
  ref
) {
  return <th ref={ref} className={cn("table-head", className)} {...props} />;
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(function TableCell(
  { className, ...props },
  ref
) {
  return <td ref={ref} className={cn("table-cell", className)} {...props} />;
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(function TableCaption(
  { className, ...props },
  ref
) {
  return (
    <caption ref={ref} className={cn("table-caption", className)} {...props} />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IncomeFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const IncomeField: React.FC<IncomeFieldProps> = ({
  label,
  id,
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        min="0"
        {...props}
      />
    </div>
  );
};

export default IncomeField;
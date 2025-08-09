import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IncomeField from "./IncomeField";

interface CapitalGainsCardProps {
  title: string;
  stcg: number | string;
  ltcg: number | string;
  onStcgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLtcgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CapitalGainsCard: React.FC<CapitalGainsCardProps> = ({
  title,
  stcg,
  ltcg,
  onStcgChange,
  onLtcgChange,
  isEditing,
  onTitleChange,
}) => {
  return (
    <Card>
      <CardHeader>
        {isEditing ? (
          <Input
            value={title}
            onChange={onTitleChange}
            placeholder="Enter Account Name"
            className="text-lg font-semibold"
          />
        ) : (
          <CardTitle>{title}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <IncomeField
          label="Short Term Capital Gains (STCG)"
          id={`${title.replace(/\s+/g, "-")}-stcg`}
          value={stcg}
          onChange={onStcgChange}
          placeholder="Enter STCG"
        />
        <IncomeField
          label="Long Term Capital Gains (LTCG)"
          id={`${title.replace(/\s+/g, "-")}-ltcg`}
          value={ltcg}
          onChange={onLtcgChange}
          placeholder="Enter LTCG"
        />
      </CardContent>
    </Card>
  );
};

export default CapitalGainsCard;
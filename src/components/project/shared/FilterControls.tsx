import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterControlsProps {
  years: string[];
  months: string[];
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onClearFilters?: () => void;
  compact?: boolean;
  className?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  years,
  months,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onClearFilters,
  compact = false,
  className = "",
}) => {
  const showClearButton = selectedYear !== "all" || selectedMonth !== "all";
  
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className={compact ? "h-8 w-[100px]" : "h-9 w-[100px] border-[#e2e8f0]"}>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map(year => (
            <SelectItem key={year} value={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className={compact ? "h-8 w-[130px]" : "h-9 w-[130px] border-[#e2e8f0]"}>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {months.map(month => (
            <SelectItem key={month} value={month}>
              {typeof month === 'string' && month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {onClearFilters && showClearButton && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className={compact ? "h-8 px-2 text-xs" : ""}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterControls; 
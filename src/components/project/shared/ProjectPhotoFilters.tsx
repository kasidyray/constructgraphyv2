import React, { useMemo } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ProjectPhotoFiltersProps {
  yearFilter: string;
  setYearFilter: (value: string) => void;
  monthFilter: string;
  setMonthFilter: (value: string) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ProjectPhotoFilters: React.FC<ProjectPhotoFiltersProps> = ({
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
}) => {
  // Get current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = MONTHS[currentDate.getMonth()];
  
  // Generate years array (current year and 2 years back)
  const years = useMemo(() => {
    return [
      (currentYear - 2).toString(),
      (currentYear - 1).toString(),
      currentYear.toString()
    ];
  }, [currentYear]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center">
        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter by:</span>
      </div>
      
      <Select 
        value={yearFilter} 
        onValueChange={(value) => {
          setYearFilter(value);
          // Reset month filter when year changes
          if (value !== yearFilter) {
            setMonthFilter(currentMonth);
          }
        }}
      >
        <SelectTrigger className="h-8 w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map(year => (
            <SelectItem key={year} value={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={monthFilter} 
        onValueChange={setMonthFilter}
      >
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {MONTHS.map(month => (
            <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(yearFilter !== "all" || monthFilter !== "all") && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setYearFilter(currentYear.toString());
            setMonthFilter(currentMonth);
          }}
          className="h-8 px-2 text-xs"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default ProjectPhotoFilters; 
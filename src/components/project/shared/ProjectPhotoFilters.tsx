import React, { useMemo } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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

  // Check if filters are different from default
  const isFilterChanged = yearFilter !== currentYear.toString() || monthFilter !== currentMonth;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        variant="outline"
        size="sm" 
        className="flex items-center gap-1 rounded-full"
      >
        <Calendar className="h-4 w-4" />
        Filters
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
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
        <SelectTrigger className="h-8 w-[100px] rounded-full">
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
        <SelectTrigger className="h-8 w-[130px] rounded-full">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {MONTHS.map(month => (
            <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isFilterChanged && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setYearFilter(currentYear.toString());
            setMonthFilter(currentMonth);
          }}
          className="h-8 w-8 rounded-full"
          title="Reset filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProjectPhotoFilters; 
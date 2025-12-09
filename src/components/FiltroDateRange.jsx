import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import useResumenStore from "@/store/useResumenStore";

export function FiltroDateRange() {
  const fetchResumen = useResumenStore((s) => s.fetchResumen);

  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  const handleSelect = (range) => {
    setDate(range);

    if (!range?.from || !range?.to) return;

    const desde = format(range.from, "yyyy-MM-dd");
    const hasta = format(range.to, "yyyy-MM-dd");

    fetchResumen({ desde, hasta });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left w-[260px]"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy", { locale: es })} -{" "}
                  {format(date.to, "dd MMM yyyy", { locale: es })}
                </>
              ) : (
                format(date.from, "dd MMM yyyy", { locale: es })
              )
            ) : (
              <span>Seleccionar rango...</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            locale={es}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

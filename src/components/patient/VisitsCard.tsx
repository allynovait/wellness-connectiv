
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { VisitDetailsDialog } from "./VisitDetailsDialog";

type VisitData = {
  date: string;
  doctor: string;
  type: string;
};

type VisitsCardProps = {
  visits: VisitData[];
};

export const VisitsCard = ({ visits }: VisitsCardProps) => {
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitData | null>(null);

  const handleVisitClick = (visit: VisitData) => {
    setSelectedVisit(visit);
    setVisitDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3">История посещений за неделю</h3>
          
          {visits.length > 0 ? (
            <div className="space-y-3">
              {visits.map((visit, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleVisitClick(visit)}
                      >
                        <div>
                          <p className="font-medium">{visit.doctor}</p>
                          <p className="text-sm text-gray-600">{visit.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{visit.date}</p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Нажмите для просмотра деталей</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">Нет посещений за последнюю неделю</p>
          )}
        </CardContent>
      </Card>

      {selectedVisit && (
        <VisitDetailsDialog
          open={visitDialogOpen}
          onOpenChange={setVisitDialogOpen}
          visitData={selectedVisit}
        />
      )}
    </>
  );
};

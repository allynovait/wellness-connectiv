
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface DoctorCardProps {
  name: string;
  specialty: string;
  imageUrl: string;
}

export const DoctorCard = ({ name, specialty, imageUrl }: DoctorCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-col items-center">
        <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <CardTitle className="text-xl text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2 text-clinic-secondary">
          <Stethoscope className="w-4 h-4" />
          <span>{specialty}</span>
        </div>
      </CardContent>
    </Card>
  );
};

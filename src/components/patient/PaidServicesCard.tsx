
import { Card, CardContent } from "@/components/ui/card";

type ServiceData = {
  date: string;
  service: string;
  cost: string;
};

type PaidServicesCardProps = {
  services: ServiceData[];
};

export const PaidServicesCard = ({ services }: PaidServicesCardProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-3">Платные услуги за неделю</h3>
        
        {services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <div>
                  <p className="font-medium">{service.service}</p>
                  <p className="text-sm text-gray-600">{service.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-clinic-primary">{service.cost}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">Нет платных услуг за последнюю неделю</p>
        )}
      </CardContent>
    </Card>
  );
};

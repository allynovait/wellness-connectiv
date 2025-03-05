
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type DocumentsProps = {
  documents: {
    passport: {
      series: string;
      number: string;
      issuedBy: string;
      issuedDate: string;
    };
    snils: string;
    inn: string;
  };
};

export const DocumentsCard = ({ documents }: DocumentsProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-3">Документы</h3>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Паспорт:</p>
            <p className="text-gray-600">Серия {documents.passport.series} Номер {documents.passport.number}</p>
            <p className="text-gray-600">Выдан: {documents.passport.issuedBy}</p>
            <p className="text-gray-600">Дата выдачи: {documents.passport.issuedDate}</p>
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <p className="font-medium">СНИЛС:</p>
            <p className="text-gray-600">{documents.snils}</p>
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <p className="font-medium">ИНН:</p>
            <p className="text-gray-600">{documents.inn}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

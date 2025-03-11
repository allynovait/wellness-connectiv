
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
  // Проверяем наличие данных паспорта
  const hasPassportData = documents.passport.series || 
                          documents.passport.number || 
                          documents.passport.issuedBy || 
                          documents.passport.issuedDate;

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-3">Документы</h3>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Паспорт:</p>
            {hasPassportData ? (
              <>
                {documents.passport.series && documents.passport.number && (
                  <p className="text-gray-600">Серия {documents.passport.series} Номер {documents.passport.number}</p>
                )}
                {documents.passport.issuedBy && (
                  <p className="text-gray-600">Выдан: {documents.passport.issuedBy}</p>
                )}
                {documents.passport.issuedDate && (
                  <p className="text-gray-600">Дата выдачи: {documents.passport.issuedDate}</p>
                )}
              </>
            ) : (
              <p className="text-gray-400 italic">Не указано</p>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <p className="font-medium">СНИЛС:</p>
            {documents.snils ? (
              <p className="text-gray-600">{documents.snils}</p>
            ) : (
              <p className="text-gray-400 italic">Не указан</p>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div>
            <p className="font-medium">ИНН:</p>
            {documents.inn ? (
              <p className="text-gray-600">{documents.inn}</p>
            ) : (
              <p className="text-gray-400 italic">Не указан</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

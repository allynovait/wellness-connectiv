
import { Card, CardContent } from "@/components/ui/card";

type PersonalInfoProps = {
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: string;
    photo: string;
  };
  medicalInfo: {
    cardNumber: string;
    attachmentDate: string;
    clinic: string;
  };
};

export const PersonalInfoCard = ({ personalInfo, medicalInfo }: PersonalInfoProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col">
          <img 
            src={personalInfo.photo} 
            alt={personalInfo.fullName || "Фото пациента"} 
            className="w-full h-auto object-cover rounded-md mb-4 max-h-[200px] object-contain bg-gray-50"
          />
          <div className="space-y-2 mt-2">
            {/* Displaying fullName above birthDate */}
            {personalInfo.fullName && (
              <h3 className="text-xl font-semibold">{personalInfo.fullName}</h3>
            )}
            <p className="text-gray-600"><span className="font-medium">Дата рождения:</span> {personalInfo.birthDate}</p>
            <p className="text-gray-600"><span className="font-medium">Пол:</span> {personalInfo.gender}</p>
            <p className="text-gray-600"><span className="font-medium">Мед. карта:</span> #{medicalInfo.cardNumber}</p>
            <p className="text-gray-600"><span className="font-medium">Дата прикрепления:</span> {medicalInfo.attachmentDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

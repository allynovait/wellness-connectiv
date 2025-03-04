
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Doctor } from "@/types/chat";

type DoctorListItemProps = {
  doctor: Doctor;
  onClick: (doctor: Doctor) => void;
  index: number;
};

export const DoctorListItem = ({ doctor, onClick, index }: DoctorListItemProps) => {
  return (
    <Card 
      key={doctor.id} 
      className="bg-white cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] animate-fade-in"
      onClick={() => onClick(doctor)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-3">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-clinic-light flex items-center justify-center text-clinic-primary flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <p className="font-medium">{doctor.name}</p>
            <p className="text-xs text-gray-500">{doctor.specialty}</p>
            {doctor.lastMessage && (
              <div>
                <p className="text-sm text-gray-700 truncate mt-1">{doctor.lastMessage}</p>
                <p className="text-xs text-gray-400">{doctor.lastMessageDate}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

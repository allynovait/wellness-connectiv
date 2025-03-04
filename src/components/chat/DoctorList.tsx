
import React from "react";
import { DoctorListItem } from "./DoctorListItem";
import { Doctor } from "@/types/chat";

type DoctorListProps = {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
};

export const DoctorList = ({ doctors, onDoctorSelect }: DoctorListProps) => {
  return (
    <div className="space-y-3 flex-grow overflow-auto">
      {doctors.map((doctor, index) => (
        <DoctorListItem 
          key={doctor.id}
          doctor={doctor}
          onClick={onDoctorSelect}
          index={index}
        />
      ))}
    </div>
  );
};

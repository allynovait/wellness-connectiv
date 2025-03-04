
import React from "react";
import { ChatHeader } from "./ChatHeader";
import { DoctorList } from "./DoctorList";
import { Doctor } from "@/types/chat";

type DoctorListViewProps = {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  onClose: () => void;
};

export const DoctorListView = ({ doctors, onDoctorSelect, onClose }: DoctorListViewProps) => {
  return (
    <div className="h-full flex flex-col">
      <ChatHeader 
        selectedDoctor={null} 
        onClose={onClose} 
        onBackToList={() => {}} 
      />
      <DoctorList doctors={doctors} onDoctorSelect={onDoctorSelect} />
    </div>
  );
};


import { useState } from "react";
import { PatientHeader } from "@/components/PatientHeader";
import { NavTabs } from "@/components/NavTabs";
import { DiagnosesTab } from "@/components/tabs/DiagnosesTab";
import { TestsTab } from "@/components/tabs/TestsTab";
import { MessagesTab } from "@/components/tabs/MessagesTab";
import { CalendarTab } from "@/components/tabs/CalendarTab";
import { ChatButton } from "@/components/ChatButton";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"diagnoses" | "tests" | "messages" | "calendar">("diagnoses");

  return (
    <div className="min-h-screen bg-clinic-background p-4 max-w-md mx-auto">
      <PatientHeader />

      <div className="space-y-6">
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "diagnoses" && <DiagnosesTab />}
        {activeTab === "tests" && <TestsTab />}
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "calendar" && <CalendarTab />}
      </div>

      <ChatButton />
    </div>
  );
};

export default Index;

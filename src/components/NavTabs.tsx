
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare, FileText } from "lucide-react";

type NavTabsProps = {
  activeTab: string;
  setActiveTab: (tab: "diagnoses" | "tests" | "messages" | "calendar") => void;
};

export const NavTabs = ({ activeTab, setActiveTab }: NavTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      <Button 
        variant={activeTab === "diagnoses" ? "default" : "outline"} 
        className={`whitespace-nowrap ${activeTab === "diagnoses" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} 
        onClick={() => setActiveTab("diagnoses")}
      >
        <FileText className="w-4 h-4 mr-2" />
        Диагнозы
      </Button>
      <Button 
        variant={activeTab === "tests" ? "default" : "outline"} 
        className={`whitespace-nowrap ${activeTab === "tests" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} 
        onClick={() => setActiveTab("tests")}
      >
        <FileText className="w-4 h-4 mr-2" />
        Анализы
      </Button>
      <Button 
        variant={activeTab === "messages" ? "default" : "outline"} 
        className={`whitespace-nowrap ${activeTab === "messages" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} 
        onClick={() => setActiveTab("messages")}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Сообщения
      </Button>
      <Button 
        variant={activeTab === "calendar" ? "default" : "outline"} 
        className={`whitespace-nowrap ${activeTab === "calendar" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} 
        onClick={() => setActiveTab("calendar")}
      >
        <CalendarDays className="w-4 h-4 mr-2" />
        Календарь
      </Button>
    </div>
  );
};

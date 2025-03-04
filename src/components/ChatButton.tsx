
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export const ChatButton = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
      <Button className="w-full bg-clinic-primary hover:bg-clinic-secondary">
        <MessageSquare className="w-4 h-4 mr-2" />
        Написать врачу
      </Button>
    </div>
  );
};

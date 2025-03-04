
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatDrawer } from "@/components/ChatDrawer";

export const ChatButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto animate-fade-in">
        <Button 
          className="w-full bg-clinic-primary hover:bg-clinic-secondary hover:scale-[1.02] transition-all"
          onClick={handleOpenDrawer}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Написать врачу
        </Button>
      </div>

      <ChatDrawer 
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};

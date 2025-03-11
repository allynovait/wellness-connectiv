
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./profile/PersonalInfoForm";
import { DocumentsForm } from "./profile/DocumentsForm";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { user, userDocuments, updateProfile, updateDocuments } = useAuth();
  
  // Ensure data is re-loaded when dialog opens
  useEffect(() => {
    console.log("Dialog open state changed:", open);
    if (open) {
      console.log("Dialog opened, current user data:", user);
      console.log("Dialog opened, current document data:", userDocuments);
    }
  }, [open, user, userDocuments]);

  const handleDialogClose = (success: boolean) => {
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl font-semibold mb-4">Редактирование профиля</DialogTitle>
        
        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="personal">Личные данные</TabsTrigger>
            <TabsTrigger value="documents">Документы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <PersonalInfoForm 
              user={user} 
              onSave={updateProfile} 
              onSuccess={() => handleDialogClose(true)} 
            />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsForm 
              userDocuments={userDocuments} 
              onSave={updateDocuments} 
              onSuccess={() => handleDialogClose(true)} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

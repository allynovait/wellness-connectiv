
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./profile/PersonalInfoForm";
import { DocumentsForm } from "./profile/DocumentsForm";
import { Loader2 } from "lucide-react";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { user, userDocuments, updateProfile, updateDocuments, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Reload user data when dialog opens
  useEffect(() => {
    const loadData = async () => {
      if (open) {
        console.log("Dialog opened, refreshing user data");
        setIsLoading(true);
        try {
          await refreshUserData();
          console.log("User data refreshed:", user);
          console.log("Document data refreshed:", userDocuments);
        } catch (error) {
          console.error("Error refreshing user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [open, refreshUserData]);
  
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-clinic-primary" />
            <span className="ml-2">Загрузка данных...</span>
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

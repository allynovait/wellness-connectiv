
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./profile/PersonalInfoForm";
import { DocumentsForm } from "./profile/DocumentsForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { user, userDocuments, updateProfile, updateDocuments, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Загружаем данные только когда диалог открывается
  useEffect(() => {
    let isMounted = true; // Для предотвращения обновления состояния после размонтирования
    
    const loadData = async () => {
      // Проверяем, что диалог открыт
      if (open) {
        console.log("Dialog opened, attempting to refresh user data");
        setIsLoading(true);
        setLoadingError(null);
        
        try {
          // Получаем данные, но НЕ обновляем состояние напрямую
          const refreshedData = await refreshUserData();
          console.log("Refreshed data successfully:", refreshedData);
          
          // Устанавливаем 500мс таймаут, чтобы избежать слишком быстрой смены состояний
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 500);
        } catch (error) {
          console.error("Error refreshing user data:", error);
          if (isMounted) {
            setLoadingError("Ошибка загрузки данных профиля");
            setIsLoading(false);
          }
        }
      }
    };
    
    if (open) {
      loadData();
    }
    
    // Очистка при размонтировании компонента
    return () => {
      isMounted = false;
    };
  }, [open, refreshUserData]);
  
  // Отладочное логирование
  useEffect(() => {
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

  const handleRetry = async () => {
    setLoadingError(null);
    setIsLoading(true);
    try {
      await refreshUserData();
      setIsLoading(false);
    } catch (error) {
      setLoadingError("Не удалось загрузить данные. Попробуйте еще раз.");
      setIsLoading(false);
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
        ) : loadingError ? (
          <div className="text-center py-8 text-red-500">
            <p>{loadingError}</p>
            <Button 
              onClick={handleRetry} 
              className="mt-4 px-4 py-2 bg-clinic-primary text-white rounded hover:bg-clinic-primary/90"
            >
              Попробовать снова
            </Button>
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

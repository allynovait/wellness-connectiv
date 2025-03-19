
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const AdminPasswordReset = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Resetting password for:", email);
      const result = await resetPassword(email, password);
      console.log("Password reset result:", result);
      
      if (result) {
        toast.success("Пароль успешно изменен");
        // Reset password field after successful reset
        setPassword("");
      } else {
        toast.error("Не удалось изменить пароль");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Ошибка при сбросе пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? "Скрыть панель администратора" : "Панель администратора"}
      </Button>
      
      {showPanel && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Сброс пароля (только для администраторов)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email пользователя</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email пользователя"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Новый пароль</Label>
                <Input
                  id="admin-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Новый пароль"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !email || !password}
              >
                {loading ? "Сброс..." : "Сбросить пароль"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

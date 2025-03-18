
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const AdminPasswordReset = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("burchik0912@gmail.com");
  const [password, setPassword] = useState("rEVEBU9988");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await resetPassword(email, password);
      if (result) {
        // Reset form after successful reset
        setPassword("");
      }
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

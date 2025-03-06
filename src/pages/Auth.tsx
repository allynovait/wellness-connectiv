
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const Auth = () => {
  const { signIn, signUp, session, loading, resendVerificationEmail, isEmailVerified } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const verificationStatus = queryParams.get('verification');
  const verified = queryParams.get('verified');

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerRole, setRegisterRole] = useState<UserRole>("patient");
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Verification
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (verificationStatus === 'pending') {
      setVerificationEmail(registerEmail);
    }
    
    if (verified === 'true') {
      setActiveTab('login');
    }
  }, [verificationStatus, verified, registerEmail]);

  if (session && !loading && isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    try {
      setLoginLoading(true);
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerName) return;

    try {
      setRegisterLoading(true);
      await signUp(registerEmail, registerPassword, registerName, registerRole);
      setVerificationEmail(registerEmail);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail) return;

    try {
      setResendLoading(true);
      await resendVerificationEmail(verificationEmail);
    } catch (error) {
      console.error("Error resending verification:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const renderVerificationAlert = () => {
    if (verificationStatus === 'pending' || verified === 'true' || (session && !isEmailVerified)) {
      return (
        <Alert 
          className={`mb-6 ${verified === 'true' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}
        >
          {verified === 'true' ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Email подтвержден!</AlertTitle>
              <AlertDescription className="text-green-600">
                Ваш email успешно подтвержден. Теперь вы можете войти в систему.
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-700">Требуется подтверждение email</AlertTitle>
              <AlertDescription className="text-yellow-600">
                Мы отправили письмо для подтверждения на ваш email. Пожалуйста, проверьте вашу почту и перейдите по ссылке в письме.
                <div className="mt-3">
                  <form onSubmit={handleResendVerification} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="verification-email">Email для повторной отправки</Label>
                      <Input
                        id="verification-email"
                        type="email"
                        value={verificationEmail}
                        onChange={(e) => setVerificationEmail(e.target.value)}
                        placeholder="Введите ваш email"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="outline" 
                      size="sm"
                      disabled={resendLoading || !verificationEmail}
                      className="flex items-center gap-1"
                    >
                      {resendLoading ? "Отправка..." : "Отправить повторно"}
                      {!resendLoading && <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </AlertDescription>
            </>
          )}
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/d200c670-f916-4464-8195-3b9de974c5cd.png" 
              alt="Гиппократ" 
              className="h-16 object-contain mix-blend-multiply" 
            />
          </div>
          
          {renderVerificationAlert()}
          
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "register")}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@mail.ru"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-clinic-primary hover:bg-clinic-primary/90"
                  disabled={loginLoading || !loginEmail || !loginPassword}
                >
                  {loginLoading ? "Загрузка..." : "Войти"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">ФИО</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="example@mail.ru"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="********"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-role">Роль</Label>
                  <Select 
                    value={registerRole} 
                    onValueChange={(value) => setRegisterRole(value as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Пациент</SelectItem>
                      <SelectItem value="doctor">Врач</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-clinic-primary hover:bg-clinic-primary/90"
                  disabled={registerLoading || !registerEmail || !registerPassword || !registerName}
                >
                  {registerLoading ? "Загрузка..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

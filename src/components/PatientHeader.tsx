
import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import { PatientProfileDialog } from "@/components/PatientProfileDialog";
import { useAuth } from "@/contexts/auth";

export const PatientHeader = () => {
  const { user, loading } = useAuth();
  const [weather, setWeather] = useState<{
    temp: number | null;
    loading: boolean;
  }>({
    temp: null,
    loading: true
  });
  
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Nizhnevartovsk&appid=8e2f1807b6c17d31d96937638184a98c&units=metric");
        const data = await response.json();
        if (data.main && data.main.temp) {
          setWeather({
            temp: Math.round(data.main.temp),
            loading: false
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Ошибка при загрузке погоды:", error);
        setWeather({
          temp: null,
          loading: false
        });
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <img src="/lovable-uploads/d200c670-f916-4464-8195-3b9de974c5cd.png" alt="Гиппократ" className="h-8 w-auto object-contain mix-blend-multiply" />
        <div className="flex justify-between items-center w-full">
          <h1 className="text-clinic-dark font-thin text-xs mx-[54px]">
            {user?.clinic || "Нижневартовск"}
          </h1>
          <div className="flex items-center gap-2 text-clinic-primary">
            {weather.loading ? <span className="text-sm">-15°C</span> : weather.temp !== null ? <span className="text-sm font-medium">{weather.temp}°C</span> : <span className="text-sm">--°C</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full bg-clinic-light flex items-center justify-center text-clinic-primary font-semibold cursor-pointer"
          onClick={() => setProfileOpen(true)}
        >
          {user?.photo ? (
            <img src={user.photo} alt="Фото" className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserRound className="w-5 h-5" />
          )}
        </div>
        <div>
          <p className="font-medium text-clinic-dark">{loading ? 'Загрузка...' : (user?.full_name || 'Гость')}</p>
          <p className="text-sm text-gray-500">Карта пациента {loading ? '...' : (user?.card_number ? `#${user.card_number}` : 'Не указана')}</p>
        </div>
      </div>

      <PatientProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

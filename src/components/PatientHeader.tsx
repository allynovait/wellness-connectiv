
import { useState, useEffect } from "react";
import { Thermometer } from "lucide-react";

export const PatientHeader = () => {
  const [weather, setWeather] = useState<{
    temp: number | null;
    loading: boolean;
  }>({
    temp: null,
    loading: true
  });

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
            Нижневартовск
          </h1>
          <div className="flex items-center gap-2 text-clinic-primary">
            {weather.loading ? <span className="text-sm">-15°C</span> : weather.temp !== null ? <span className="text-sm font-medium">{weather.temp}°C</span> : <span className="text-sm">--°C</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-clinic-light flex items-center justify-center text-clinic-primary font-semibold">
          ИИ
        </div>
        <div>
          <p className="font-medium text-clinic-dark">Иван Иванов</p>
          <p className="text-sm text-gray-500">Карта пациента #12345</p>
        </div>
      </div>
    </div>
  );
};

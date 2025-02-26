
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/DoctorCard";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Hospital, Clock, Phone, MapPin } from "lucide-react";

const doctors = [
  {
    name: "Анна Петрова",
    specialty: "Терапевт",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=300&auto=format&fit=crop",
  },
  {
    name: "Михаил Иванов",
    specialty: "Кардиолог",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=300&auto=format&fit=crop",
  },
  {
    name: "Елена Сидорова",
    specialty: "Невролог",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&h=300&auto=format&fit=crop",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-clinic-background">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-clinic-primary to-clinic-secondary text-white">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-fadeIn">
            <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">
              Клиника "Здоровье"
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Ваше здоровье - наш главный приоритет
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Современное оборудование и опытные специалисты для вашего здоровья
            </p>
            <Button className="bg-white text-clinic-primary hover:bg-white/90">
              Записаться на приём
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-clinic-light text-clinic-primary">
            Наши специалисты
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Опытные врачи к вашим услугам
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.name} {...doctor} />
          ))}
        </div>
      </section>

      {/* Appointment Section */}
      <section className="py-20 bg-clinic-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-clinic-primary text-white">
              Запись на приём
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Записаться к врачу
            </h2>
          </div>
          <AppointmentForm />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-clinic-light text-clinic-primary">
              Контакты
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Как с нами связаться
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <Phone className="w-8 h-8 text-clinic-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Телефон</h3>
              <p className="text-gray-600">+7 (999) 999-99-99</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <Clock className="w-8 h-8 text-clinic-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Часы работы</h3>
              <p className="text-gray-600">Пн-Пт: 8:00 - 20:00</p>
              <p className="text-gray-600">Сб-Вс: 9:00 - 18:00</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <MapPin className="w-8 h-8 text-clinic-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Адрес</h3>
              <p className="text-gray-600 text-center">
                ул. Медицинская, д. 1
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

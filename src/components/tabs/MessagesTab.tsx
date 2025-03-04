
import { Card, CardContent } from "@/components/ui/card";

// Mock data for messages
const mockMessages = [{
  id: 1,
  date: "2024-03-15",
  text: "Пожалуйста, продолжайте приём препарата еще 5 дней",
  doctor: "Др. Петрова"
}, {
  id: 2,
  date: "2024-03-14",
  text: "Результаты анализов в норме",
  doctor: "Др. Петрова"
}];

export const MessagesTab = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Сообщения от врача</h2>
      
      {mockMessages.map(message => (
        <Card key={message.id} className="bg-white">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">{message.doctor}</p>
                <p className="text-sm text-gray-500">{message.date}</p>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

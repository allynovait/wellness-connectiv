
import { Card, CardContent } from "@/components/ui/card";

type TestData = {
  date: string;
  name: string;
  status: string;
};

type TestsCardProps = {
  tests: TestData[];
};

export const TestsCard = ({ tests }: TestsCardProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-3">Анализы за неделю</h3>
        
        {tests.length > 0 ? (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-gray-600">Статус: {test.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{test.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">Нет анализов за последнюю неделю</p>
        )}
      </CardContent>
    </Card>
  );
};

import { Clock, CheckCircle2, AlertTriangle, Package, Users, TrendingUp } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'delivery' | 'task' | 'alert' | 'update';
  title: string;
  description: string;
  time: string;
  object?: string;
}

const feedItems: FeedItem[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Доставка материалов',
    description: 'Кирпич 2000 шт. прибыл на объект',
    time: '10 мин назад',
    object: 'ул. Ленина 25',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Внимание',
    description: 'Заканчивается цемент на объекте Мира 15',
    time: '30 мин назад',
    object: 'пр. Мира 15',
  },
  {
    id: '3',
    type: 'task',
    title: 'Задача выполнена',
    description: 'Штукатурка стен завершена',
    time: '1 час назад',
    object: 'ул. Ленина 25',
  },
  {
    id: '4',
    type: 'update',
    title: 'Обновление статуса',
    description: 'Новый рабочий добавлен в бригаду',
    time: '2 часа назад',
  },
];

const typeIcons = {
  delivery: Package,
  task: CheckCircle2,
  alert: AlertTriangle,
  update: TrendingUp,
};

const typeColors = {
  delivery: 'text-blue-400 bg-blue-400/20',
  task: 'text-green-400 bg-green-400/20',
  alert: 'text-orange-400 bg-orange-400/20',
  update: 'text-purple-400 bg-purple-400/20',
};

/**
 * ForemanFeedPage - лента событий прораба
 */
export function ForemanFeedPage() {
  const stats = [
    { label: 'Объектов', value: '5', icon: Package },
    { label: 'Рабочих', value: '23', icon: Users },
    { label: 'Задач на сегодня', value: '12', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl p-4">
            <stat.icon className="h-6 w-6 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Лента событий</h2>
        <div className="space-y-3">
          {feedItems.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl p-4 flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg ${typeColors[item.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                    {item.object && (
                      <>
                        <span>•</span>
                        <span>{item.object}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

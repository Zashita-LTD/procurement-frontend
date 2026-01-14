import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  DollarSign, 
  MoreVertical, 
  Plus,
  Calendar
} from 'lucide-react';

interface Project {
  id: string;
  address: string;
  client: {
    name: string;
    phone: string;
  };
  balance: number;
  spent: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  progress: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    address: 'ул. Ленина 25, кв. 42',
    client: { name: 'Иванов Сергей', phone: '+7 999 123-45-67' },
    balance: 85000,
    spent: 215000,
    status: 'active',
    startDate: '2026-01-05',
    progress: 65,
  },
  {
    id: '2',
    address: 'пр. Мира 15, кв. 8',
    client: { name: 'Петрова Анна', phone: '+7 999 234-56-78' },
    balance: 42000,
    spent: 158000,
    status: 'active',
    startDate: '2025-12-20',
    progress: 80,
  },
  {
    id: '3',
    address: 'ул. Гагарина 7, дом',
    client: { name: 'Козлов Дмитрий', phone: '+7 999 345-67-89' },
    balance: 0,
    spent: 450000,
    status: 'completed',
    startDate: '2025-11-01',
    progress: 100,
  },
];

const statusLabels = {
  active: { label: 'В работе', color: 'text-green-400 bg-green-400/20' },
  paused: { label: 'Пауза', color: 'text-yellow-400 bg-yellow-400/20' },
  completed: { label: 'Завершён', color: 'text-gray-400 bg-gray-400/20' },
};

/**
 * MyProjects - карточки объектов для ремонтников
 */
export function MyProjects() {
  const [projects] = useState<Project[]>(mockProjects);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => filter === 'active' ? p.status !== 'completed' : p.status === 'completed');

  const totalBalance = projects.filter(p => p.status === 'active').reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Активных объектов</p>
          <p className="text-2xl font-bold text-white mt-1">
            {projects.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Общий баланс</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {totalBalance.toLocaleString()} ₽
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'Все' },
          { value: 'active', label: 'Активные' },
          { value: 'completed', label: 'Завершённые' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            to={`/pro/projects/${project.id}`}
            className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{project.address}</h3>
                  <p className="text-sm text-gray-400">{project.client.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[project.status].color}`}>
                {statusLabels[project.status].label}
              </span>
            </div>

            {/* Progress */}
            {project.status !== 'completed' && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Прогресс</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">
                    {project.balance.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.startDate).toLocaleDateString('ru')}</span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); }}
                className="p-1 rounded hover:bg-gray-700"
              >
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Нет объектов</p>
          <Link 
            to="/pro/projects/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Добавить объект
          </Link>
        </div>
      )}
    </div>
  );
}

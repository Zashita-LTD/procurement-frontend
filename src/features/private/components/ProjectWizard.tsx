import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProjectType = 'apartment' | 'house' | null;
type RoomType = 'studio' | '1room' | '2room' | '3room' | '4plus';
type WorkType = 'rough' | 'finish' | 'full' | 'design';

interface WizardStep {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * ProjectWizard - мастер создания проекта для частников
 * "Что строим?" (Квартира/Дом)
 */
export function ProjectWizard() {
  const navigate = useNavigate();
  const [projectType, setProjectType] = useState<ProjectType>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [step, setStep] = useState(1);

  const steps: WizardStep[] = [
    { id: 1, title: 'Тип жилья', completed: !!projectType },
    { id: 2, title: 'Планировка', completed: !!roomType },
    { id: 3, title: 'Работы', completed: workTypes.length > 0 },
  ];

  const projectOptions = [
    { type: 'apartment' as const, icon: Building2, title: 'Квартира', description: 'Ремонт в многоквартирном доме' },
    { type: 'house' as const, icon: Home, title: 'Дом', description: 'Частный дом или таунхаус' },
  ];

  const roomOptions = [
    { type: 'studio' as const, title: 'Студия', area: '25-40 м²' },
    { type: '1room' as const, title: 'Однушка', area: '35-50 м²' },
    { type: '2room' as const, title: 'Двушка', area: '50-70 м²' },
    { type: '3room' as const, title: 'Трёшка', area: '70-100 м²' },
    { type: '4plus' as const, title: '4+ комнат', area: '100+ м²' },
  ];

  const workOptions = [
    { type: 'rough' as const, title: 'Черновая', description: 'Стяжка, штукатурка, электрика', price: 'от 3 000 ₽/м²' },
    { type: 'finish' as const, title: 'Чистовая', description: 'Обои, плитка, ламинат', price: 'от 5 000 ₽/м²' },
    { type: 'full' as const, title: 'Под ключ', description: 'Полный ремонт', price: 'от 8 000 ₽/м²' },
    { type: 'design' as const, title: 'Дизайн-проект', description: 'С авторским надзором', price: 'от 15 000 ₽/м²' },
  ];

  const toggleWorkType = (type: WorkType) => {
    setWorkTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleComplete = () => {
    // Сохраняем проект и переходим к списку готовых наборов
    const project = {
      type: projectType,
      rooms: roomType,
      works: workTypes,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('current_project', JSON.stringify(project));
    navigate('/private/inspiration');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Что строим? ✨</h1>
        <p className="text-gray-500 mt-1">Расскажите о вашем проекте</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setStep(s.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${step === s.id 
                  ? 'bg-blue-600 text-white' 
                  : s.completed
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
            >
              {s.completed && step !== s.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{s.id}</span>
              )}
              <span>{s.title}</span>
            </button>
            {idx < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Project Type */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-4">
          {projectOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                setProjectType(option.type);
                setStep(2);
              }}
              className={`
                flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all
                ${projectType === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                p-4 rounded-xl
                ${projectType === option.type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <option.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              {projectType === option.type && (
                <Check className="ml-auto h-6 w-6 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Room Type */}
      {step === 2 && (
        <div className="grid grid-cols-2 gap-3">
          {roomOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                setRoomType(option.type);
                setStep(3);
              }}
              className={`
                p-4 rounded-xl border-2 text-left transition-all
                ${roomType === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-500">{option.area}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Work Types */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {workOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => toggleWorkType(option.type)}
                className={`
                  flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all
                  ${workTypes.includes(option.type)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{option.price}</p>
                  {workTypes.includes(option.type) && (
                    <Check className="h-5 w-5 text-blue-500 ml-auto mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {workTypes.length > 0 && (
            <Button 
              onClick={handleComplete}
              className="w-full py-6 text-lg rounded-xl"
            >
              Показать готовые наборы
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Вымышленные персонажи - жители цифрового города закупок.
 * Богатые профили с историями, семьями и взаимоотношениями.
 */

import type { UserProfile, UserListItem, UserRole } from '../types/extended';

// === ГЛАВНЫЙ АДМИНИСТРАТОР ===
export const VICTOR_LAVRENTIEV: UserProfile = {
  id: 'user-100-victor-lavrentiev',
  email: 'info@97v.ru',
  first_name: 'Виктор',
  last_name: 'Лаврентьев',
  middle_name: 'Петрович',
  full_name: 'Лаврентьев Виктор Петрович',
  
  avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=victor',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  ],
  
  phone: '+7 (495) 123-45-67',
  telegram: '@victor_lavrentiev',
  
  country: 'Россия',
  city: 'Москва',
  address: 'ул. Тверская, д. 12, кв. 48',
  postal_code: '125009',
  
  birth_date: '1978-05-15',
  
  role: 'primary_admin',
  permissions: ['all'],
  is_active: true,
  is_verified: true,
  
  family_status: 'married',
  children_count: 2,
  family_info: {
    spouse: 'Елена Викторовна Лаврентьева',
    children: [
      { name: 'Александр', birth_year: 2005, occupation: 'студент' },
      { name: 'Мария', birth_year: 2010, occupation: 'школьница' }
    ]
  },
  
  job_title: 'Генеральный директор',
  department: 'Руководство',
  work_experience: [
    { company: 'ООО Защита', position: 'Генеральный директор', from: '2015', to: 'present' },
    { company: 'ПАО Стройтех', position: 'Коммерческий директор', from: '2010', to: '2015' },
    { company: 'ЗАО Ресурс', position: 'Руководитель отдела закупок', from: '2005', to: '2010' }
  ],
  
  education: {
    university: 'МГУ им. М.В. Ломоносова',
    faculty: 'Экономический факультет',
    degree: 'MBA',
    graduation_year: 2003
  },
  
  hobbies: ['Гольф', 'Яхтинг', 'Шахматы', 'Путешествия'],
  interests: ['Инновации', 'Искусственный интеллект', 'Устойчивое развитие'],
  
  bio: `Основатель и генеральный директор группы компаний «Защита». Более 20 лет опыта в сфере закупок и управления цепочками поставок.

Визионер, превративший небольшую торговую компанию в технологического лидера отрасли. Под его руководством была создана уникальная AI-платформа для автоматизации закупок, которая сейчас обслуживает более 500 компаний.

«Будущее закупок — это полная прозрачность, скорость и интеллектуальная автоматизация. Мы строим цифровой город, где каждая сделка оставляет след, каждый участник известен, а доверие базируется на данных, а не на обещаниях.»`,

  achievements: [
    'Премия "Предприниматель года" (2022)',
    'Включен в рейтинг Top-100 руководителей России (2023)',
    'Автор книги "Цифровые закупки: стратегия будущего"',
    'Спикер Петербургского экономического форума (2024)',
    'Основатель благотворительного фонда "Строим будущее"'
  ],
  
  total_orders: 0,
  total_spent: 0,
  loyalty_points: 100000,
  rating: 5.0,
  
  tags: ['founder', 'vip', 'speaker'],
  
  created_at: '2020-01-15T10:00:00Z',
  updated_at: '2026-01-18T12:00:00Z',
  last_login: '2026-01-18T09:30:00Z'
};

// === КОМАНДА РУКОВОДИТЕЛЕЙ ===
export const TEAM_LEADERS: UserProfile[] = [
  {
    id: 'user-101-anna-sokolova',
    email: 'a.sokolova@zashita.ru',
    first_name: 'Анна',
    last_name: 'Соколова',
    middle_name: 'Сергеевна',
    full_name: 'Соколова Анна Сергеевна',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=anna',
    phone: '+7 (495) 123-45-68',
    telegram: '@anna_sokolova',
    city: 'Москва',
    birth_date: '1985-08-22',
    role: 'director',
    permissions: ['finance', 'reports', 'budgets', 'approvals'],
    is_active: true,
    is_verified: true,
    family_status: 'married',
    children_count: 1,
    job_title: 'Финансовый директор',
    department: 'Финансы',
    education: {
      university: 'РЭУ им. Плеханова',
      degree: 'Кандидат экономических наук',
      graduation_year: 2008
    },
    bio: `Финансовый стратег с 15-летним опытом. Внедрила систему управления бюджетами, сократившую операционные расходы на 23%.

Эксперт по финансовому моделированию и оптимизации денежных потоков. Руководит командой из 12 финансовых аналитиков.`,
    hobbies: ['Йога', 'Современное искусство', 'Винный туризм'],
    achievements: [
      'Лучший финансовый директор года (2023)',
      'Сертифицированный аудитор ACCA'
    ],
    total_orders: 156,
    total_spent: 45000000,
    loyalty_points: 45000,
    rating: 4.9,
    created_at: '2020-03-01T09:00:00Z',
    updated_at: '2026-01-17T15:30:00Z'
  },
  {
    id: 'user-102-dmitry-petrov',
    email: 'd.petrov@zashita.ru',
    first_name: 'Дмитрий',
    last_name: 'Петров',
    middle_name: 'Андреевич',
    full_name: 'Петров Дмитрий Андреевич',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=dmitry',
    phone: '+7 (495) 123-45-69',
    telegram: '@dmitry_petrov',
    city: 'Санкт-Петербург',
    birth_date: '1982-03-10',
    role: 'director',
    permissions: ['tech', 'development', 'infrastructure', 'security'],
    is_active: true,
    is_verified: true,
    family_status: 'married',
    children_count: 2,
    job_title: 'Технический директор',
    department: 'IT',
    education: {
      university: 'СПбПУ Петра Великого',
      degree: 'PhD Computer Science',
      graduation_year: 2007
    },
    bio: `Архитектор цифровой трансформации компании. Руководил разработкой AI-платформы для автоматизации закупок.

15 лет в IT-индустрии. Ранее работал в Яндексе и Mail.ru. Евангелист open-source и микросервисной архитектуры.`,
    hobbies: ['Программирование', '3D-печать', 'Дроны', 'Киберспорт'],
    achievements: [
      'Автор 5 патентов в области ML',
      'Спикер конференций HighLoad++ и DevOps Conf'
    ],
    total_orders: 89,
    total_spent: 28000000,
    loyalty_points: 28000,
    rating: 4.95,
    created_at: '2020-02-15T10:00:00Z',
    updated_at: '2026-01-18T08:00:00Z'
  },
  {
    id: 'user-103-maria-ivanova',
    email: 'm.ivanova@zashita.ru',
    first_name: 'Мария',
    last_name: 'Иванова',
    middle_name: 'Александровна',
    full_name: 'Иванова Мария Александровна',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=maria',
    phone: '+7 (495) 123-45-70',
    telegram: '@maria_ivanova',
    city: 'Москва',
    birth_date: '1988-11-05',
    role: 'director',
    permissions: ['sales', 'clients', 'partners', 'marketing'],
    is_active: true,
    is_verified: true,
    family_status: 'single',
    children_count: 0,
    job_title: 'Коммерческий директор',
    department: 'Продажи',
    education: {
      university: 'НИУ ВШЭ',
      degree: 'MBA',
      graduation_year: 2013
    },
    bio: `Увеличила клиентскую базу в 3 раза за 2 года. Эксперт по B2B-продажам и партнёрским программам.

Создала уникальную систему лояльности, которая повысила retention rate до 94%.`,
    hobbies: ['Бизнес-нетворкинг', 'Теннис', 'Путешествия', 'Фотография'],
    achievements: [
      'Top Sales Director Russia (2024)',
      'Член совета директоров ассоциации B2B-продаж'
    ],
    total_orders: 234,
    total_spent: 67000000,
    loyalty_points: 67000,
    rating: 4.85,
    created_at: '2021-01-10T09:00:00Z',
    updated_at: '2026-01-17T18:00:00Z'
  }
];

// === МЕНЕДЖЕРЫ ПО ЗАКУПКАМ ===
export const PROCUREMENT_MANAGERS: UserProfile[] = [
  {
    id: 'user-201-sergey-kozlov',
    email: 's.kozlov@zashita.ru',
    first_name: 'Сергей',
    last_name: 'Козлов',
    middle_name: 'Владимирович',
    full_name: 'Козлов Сергей Владимирович',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=sergey',
    phone: '+7 (495) 123-45-80',
    city: 'Москва',
    birth_date: '1990-07-18',
    role: 'procurement_specialist',
    permissions: ['orders', 'suppliers', 'catalog'],
    is_active: true,
    is_verified: true,
    family_status: 'married',
    children_count: 1,
    job_title: 'Старший менеджер по закупкам',
    department: 'Закупки',
    bio: `Специализируется на закупках строительных материалов. Экономит компании до 15% на каждой сделке.

7 лет в сфере B2B-закупок. Знает все нюансы работы с крупнейшими поставщиками: Петрович, Леруа Мерлен, ЭТМ.`,
    hobbies: ['Футбол', 'Рыбалка', 'Автомобили'],
    total_orders: 456,
    total_spent: 125000000,
    loyalty_points: 125000,
    rating: 4.7,
    created_at: '2021-06-01T09:00:00Z',
    updated_at: '2026-01-18T10:00:00Z'
  },
  {
    id: 'user-202-ekaterina-nikolaeva',
    email: 'e.nikolaeva@zashita.ru',
    first_name: 'Екатерина',
    last_name: 'Николаева',
    middle_name: 'Павловна',
    full_name: 'Николаева Екатерина Павловна',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=ekaterina',
    phone: '+7 (495) 123-45-81',
    city: 'Москва',
    birth_date: '1992-02-28',
    role: 'procurement_specialist',
    permissions: ['orders', 'suppliers', 'catalog'],
    is_active: true,
    is_verified: true,
    family_status: 'single',
    children_count: 0,
    job_title: 'Менеджер по закупкам (электрика)',
    department: 'Закупки',
    bio: `Эксперт по электротехническому оборудованию. Сертифицированный специалист ABB и Schneider Electric.

Ведёт 50+ крупных клиентов из промышленного сектора.`,
    hobbies: ['Танцы', 'Фитнес', 'Кулинария'],
    total_orders: 312,
    total_spent: 89000000,
    loyalty_points: 89000,
    rating: 4.8,
    created_at: '2022-01-15T09:00:00Z',
    updated_at: '2026-01-17T16:30:00Z'
  },
  {
    id: 'user-203-alexey-volkov',
    email: 'a.volkov@zashita.ru',
    first_name: 'Алексей',
    last_name: 'Волков',
    middle_name: 'Игоревич',
    full_name: 'Волков Алексей Игоревич',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=alexey',
    phone: '+7 (343) 123-45-82',
    city: 'Екатеринбург',
    birth_date: '1987-09-12',
    role: 'procurement_specialist',
    permissions: ['orders', 'suppliers', 'catalog', 'regional'],
    is_active: true,
    is_verified: true,
    family_status: 'married',
    children_count: 2,
    job_title: 'Региональный менеджер по закупкам',
    department: 'Закупки (Урал)',
    bio: `Координирует закупки для проектов на Урале и в Сибири. 10 лет в сфере B2B.

Знает всех региональных поставщиков. Оптимизировал логистику, сократив сроки доставки на 30%.`,
    hobbies: ['Горные лыжи', 'Охота', 'Туризм'],
    total_orders: 278,
    total_spent: 156000000,
    loyalty_points: 156000,
    rating: 4.6,
    created_at: '2021-09-01T09:00:00Z',
    updated_at: '2026-01-16T14:00:00Z'
  },
  {
    id: 'user-204-olga-smirnova',
    email: 'o.smirnova@zashita.ru',
    first_name: 'Ольга',
    last_name: 'Смирнова',
    middle_name: 'Дмитриевна',
    full_name: 'Смирнова Ольга Дмитриевна',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=olga',
    phone: '+7 (495) 123-45-83',
    city: 'Москва',
    birth_date: '1995-04-03',
    role: 'procurement_specialist',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    family_status: 'single',
    children_count: 0,
    job_title: 'Младший менеджер по закупкам',
    department: 'Закупки',
    bio: `Молодой специалист, быстро освоивший систему. Отвечает за канцелярию, офисные принадлежности и мелкие закупки.

Проходит обучение по программе "Профессионал закупок 2026".`,
    hobbies: ['Блогинг', 'Йога', 'Путешествия', 'Кофе'],
    total_orders: 145,
    total_spent: 12000000,
    loyalty_points: 12000,
    rating: 4.5,
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2026-01-18T11:00:00Z'
  }
];

// === КЛИЕНТЫ ===
export const CLIENTS: UserProfile[] = [
  {
    id: 'user-501-pavel-belov',
    email: 'p.belov@stroymaster.ru',
    first_name: 'Павел',
    last_name: 'Белов',
    middle_name: 'Анатольевич',
    full_name: 'Белов Павел Анатольевич',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=pavel',
    phone: '+7 (495) 555-12-34',
    city: 'Москва',
    birth_date: '1970-08-14',
    role: 'client',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    family_status: 'married',
    children_count: 3,
    job_title: 'Директор',
    bio: `Владелец строительной компании «СтройМастер». 25 лет в строительном бизнесе.

Постоянный клиент с 2018 года. Построил более 500 000 м² жилья. VIP-статус.`,
    achievements: [
      'Заслуженный строитель России',
      'Премия "Надёжный застройщик" (2020-2025)'
    ],
    total_orders: 89,
    total_spent: 234000000,
    loyalty_points: 234000,
    rating: 4.9,
    created_at: '2018-03-15T10:00:00Z',
    updated_at: '2026-01-17T09:00:00Z'
  },
  {
    id: 'user-502-andrey-gromov',
    email: 'a.gromov@megastroy.ru',
    first_name: 'Андрей',
    last_name: 'Громов',
    middle_name: 'Петрович',
    full_name: 'Громов Андрей Петрович',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=andrey',
    phone: '+7 (812) 555-56-78',
    city: 'Санкт-Петербург',
    birth_date: '1975-03-22',
    role: 'client',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    job_title: 'Генеральный директор',
    bio: `Руководит крупнейшим застройщиком Северо-Запада. Реализовал более 50 жилых комплексов.

Инвестирует в инновационные строительные технологии.`,
    total_orders: 156,
    total_spent: 567000000,
    loyalty_points: 567000,
    rating: 4.8,
    created_at: '2019-05-20T10:00:00Z',
    updated_at: '2026-01-15T14:00:00Z'
  },
  {
    id: 'user-503-vladimir-karpov',
    email: 'v.karpov@electropro.ru',
    first_name: 'Владимир',
    last_name: 'Карпов',
    middle_name: 'Николаевич',
    full_name: 'Карпов Владимир Николаевич',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=vladimir',
    phone: '+7 (843) 555-90-12',
    city: 'Казань',
    birth_date: '1983-11-07',
    role: 'client',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    job_title: 'Технический директор',
    bio: `Специализируется на промышленной электрике. Клиент с самым большим средним чеком.

Ведущий эксперт по электрификации промышленных объектов в Татарстане.`,
    total_orders: 67,
    total_spent: 345000000,
    loyalty_points: 345000,
    rating: 4.95,
    created_at: '2020-02-10T10:00:00Z',
    updated_at: '2026-01-18T11:30:00Z'
  },
  {
    id: 'user-504-natalya-zaitseva',
    email: 'n.zaitseva@homedesign.ru',
    first_name: 'Наталья',
    last_name: 'Зайцева',
    middle_name: 'Олеговна',
    full_name: 'Зайцева Наталья Олеговна',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=natalya',
    phone: '+7 (495) 555-34-56',
    city: 'Москва',
    birth_date: '1990-06-30',
    role: 'client',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    job_title: 'Дизайнер интерьеров',
    bio: `Известный дизайнер интерьеров, работает с премиум-сегментом. Заказывает только лучшие материалы.

Её проекты публикуются в AD, Elle Decoration, SALON.`,
    achievements: [
      'Дизайнер года Elle Decoration (2024)',
      'Более 100 реализованных проектов'
    ],
    hobbies: ['Искусство', 'Путешествия', 'Антиквариат'],
    total_orders: 234,
    total_spent: 78000000,
    loyalty_points: 78000,
    rating: 5.0,
    created_at: '2021-08-05T10:00:00Z',
    updated_at: '2026-01-17T16:00:00Z'
  },
  {
    id: 'user-505-rustam-abdullaev',
    email: 'r.abdullaev@building-group.ru',
    first_name: 'Рустам',
    last_name: 'Абдуллаев',
    middle_name: 'Фаридович',
    full_name: 'Абдуллаев Рустам Фаридович',
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=rustam',
    phone: '+7 (861) 555-78-90',
    city: 'Краснодар',
    birth_date: '1978-04-18',
    role: 'client',
    permissions: ['orders', 'catalog'],
    is_active: true,
    is_verified: true,
    job_title: 'Учредитель',
    bio: `Владеет сетью строительных компаний на Юге России. Ключевой партнёр в регионе.

Реализует крупнейшие инфраструктурные проекты: жильё, дороги, промышленные объекты.`,
    total_orders: 445,
    total_spent: 892000000,
    loyalty_points: 892000,
    rating: 4.7,
    created_at: '2019-01-20T10:00:00Z',
    updated_at: '2026-01-16T12:00:00Z'
  }
];

// === ВСЕ ПОЛЬЗОВАТЕЛИ ===
export const ALL_USERS: UserProfile[] = [
  VICTOR_LAVRENTIEV,
  ...TEAM_LEADERS,
  ...PROCUREMENT_MANAGERS,
  ...CLIENTS
];

// === HELPER FUNCTIONS ===

export function getUserById(id: string): UserProfile | undefined {
  return ALL_USERS.find(u => u.id === id);
}

export function getUserByEmail(email: string): UserProfile | undefined {
  return ALL_USERS.find(u => u.email === email);
}

export function getUsersByRole(role: UserRole): UserProfile[] {
  return ALL_USERS.filter(u => u.role === role);
}

export function getUsersListItems(): UserListItem[] {
  return ALL_USERS.map(u => ({
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    avatar_url: u.avatar_url,
    role: u.role,
    job_title: u.job_title,
    city: u.city,
    rating: u.rating,
    total_orders: u.total_orders
  }));
}

export function getTopBuyers(limit: number = 10): UserListItem[] {
  return [...ALL_USERS]
    .filter(u => u.total_orders > 0)
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, limit)
    .map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      role: u.role,
      job_title: u.job_title,
      city: u.city,
      rating: u.rating,
      total_orders: u.total_orders
    }));
}

export function getUsersStatistics() {
  const users_by_role: Record<string, number> = {};
  const users_by_city: Record<string, number> = {};
  
  ALL_USERS.forEach(u => {
    users_by_role[u.role] = (users_by_role[u.role] || 0) + 1;
    if (u.city) {
      users_by_city[u.city] = (users_by_city[u.city] || 0) + 1;
    }
  });
  
  return {
    total_users: ALL_USERS.length,
    active_users: ALL_USERS.filter(u => u.is_active).length,
    users_by_role,
    users_by_city,
    top_buyers: getTopBuyers(10).map(u => ({
      id: u.id,
      name: u.full_name,
      total_orders: u.total_orders,
      total_spent: ALL_USERS.find(au => au.id === u.id)?.total_spent || 0
    }))
  };
}

# Shards — Domain Contract

> Единственный источник правды по бизнес-логике.
> Код противоречит документу → код неправ.
> Документ неполон → дополни ПЕРЕД кодом, не после.

Версия: 1.1
Статус: frozen

---

## 0. Зачем это приложение

Существующие трекеры привычек, финансов и задач работают в изоляции.
Человек держит 3–5 приложений и не видит общей картины.
Итог: мотивация разваливается, потому что всё не сходится.

**Shards** — одна экосистема, где реальные действия влияют на осколки
(шкалы) персонажа. Осколки влияют на множитель опыта. Опыт ведёт к
уровням. Уровни открывают призы. Всё связано. Одна картина жизни.

## 0.1. Принципы проектирования

Эти принципы важнее любой конкретной формулы. Если фича им
противоречит — фича неправильная.

1. **Медленное восстановление, честный урон.**
   Один пропуск не рушит прогресс. Неделя пропусков — рушит заметно.
   Откат не мгновенный. Как в реальной жизни.

2. **Процесс важнее исхода.**
   Награждаем за то, что человек КОНТРОЛИРУЕТ (действия,
   декомпозицию, рефлексию), а не за то, что от него не зависит
   (успех, признание, результат).

3. **Осознанность > запреты.**
   Не заставляем связывать всё с мечтой. Показываем зеркало:
   «60% действий шло в мечты, 40% — в maintenance». Решает пользователь.

4. **Никаких двойных гейтов.**
   Одно правило — один эффект. Что выводится из другого — выводим,
   а не дублируем.

5. **Хранить факты, вычислять производные.**
   Уровень, множитель, шкала — вычисляемые. Один источник правды —
   история действий.

6. **История неизменна.**
   Удаление привычки не откатывает счётчик вехи. Изменение веса
   не пересчитывает прошлые дни. Факт есть факт.

---

## 1. Три уровня абстракции

| Уровень | Что показывает | Страницы |
|---|---|---|
| **Текущий момент** | Что делать сегодня | Dashboard, Habits, Quests |
| **Стратегия** | Куда иду и зачем | Dreams, Milestones |
| **История** | Что уже прошёл | Achievements, Charts |
| **Экономика** | Обратная связь | Rewards, XP, Level |

---

## 2. Словарь домена

### 2.1. Dream (Мечта)
Вектор. Большая цель без счётчика и без дедлайна.
Примеры: «Стать музыкантом», «Здоровое тело», «Финансовая независимость».
Не закрывается никогда. К ней только приближаешься.
Без Milestones бессмысленна.

### 2.2. Milestone (Веха)
Конкретный шаг к мечте. Двух типов:

**Trackable** — измеряется числом. Автоматически инкрементируется.
  Пример: «100 написанных битов», «100 тренировок planche».

**Declarative** — без счётчика. Пользователь отмечает вручную.
  Пример: «Full planche», «10k слушателей в месяц».

Обязательно привязан к Dream.

### 2.3. Achievement (Трофей)
Запись о достижении milestone. Создаётся автоматически при переходе
milestone в `achieved`.

Отличия от Milestone:
- Milestone — «я работаю над этим». Achievement — «я это сделал».
- К Achievement крепится воспоминание: дата, заметка, фото.
- Achievement неизменяем. Как трофей в музее.

### 2.4. Scale (Осколок)
Одна из четырёх сфер жизни: **Health, Finance, Career, Projects**.
В UI называем «осколок», в коде — `Scale`.

Состояние — число 0..120 (%).
- 0–100 — обычный диапазон.
- 100–120 — сверхпродуктивность, только за счёт нерутины.

Шкала — вычисляемая величина, не хранится.

### 2.5. Habit (Рутинная привычка)
Повторяющееся действие в рамках одного осколка.

- Расписание: ежедневно / по дням недели / раз в N дней.
- Вес: «Важно» (w=2) или «Желательно» (w=1).
- Может быть привязана к Milestone (работает на мечту).
- Без привязки — maintenance.
- При пропуске в свой день → daily score падает.

### 2.6. Quest (Разовая задача)
Одноразовое действие. Без расписания. Без штрафа.

- Может быть привязан к Milestone.
- Тип по затратам: `decompose | normal | heavy`.
- При выполнении даёт XP и бонус к шкале.

### 2.7. CheckIn (Отметка)
Факт выполнения Habit в конкретный день.

### 2.8. Reward (Приз)
Активность-награда: «2 часа игр», «День без работы», «Фильм вечером».

- Не тратит XP.
- Гейтится текущим состоянием шкал.
- Открывается автоматически, когда все условия выполнены.
- Закрывается автоматически при падении шкал.
- Нельзя накопить про запас.

### 2.9. PauseDay (Пауза)
Отметка дня как «объективная пауза»: болезнь, больница, военкомат,
переезд, форс-мажор.

- В этот день daily score шкалы = K (сохраняет форму).
- XP НЕ начисляется.
- **Обязательное поле `note`** — короткая причина (1–2 строки).
- **Без лимита.** Но приложение показывает статистику: «X дней
  паузы в этом месяце (Y% времени)». Зеркало, не запрет.

### 2.10. DailyReflection (Рефлексия дня) — отложено
Опциональная запись дня из 3 фиксированных вопросов.
НЕ входит в MVP. Обсудим после Фазы 2.

---

## 3. Математическая модель

Все константы — в `shared/config/balance.ts`. Балансировать только там.
Никаких magic numbers в логике.

### 3.1. Константы баланса

```ts
export const BALANCE = {
  WINDOW_DAYS: 7,           // скользящее окно шкалы
  DAILY_POOL_XP: 50,        // XP/день/шкала при полной рутине
  SCALE_MAX: 120,           // максимум шкалы

  QUEST_XP: {
    decompose: 20,
    normal: 40,
    heavy: 80,
  },

  QUEST_SCALE_BONUS: {
    decompose: 0,
    normal: 10,
    heavy: 20,
  },

  LEVEL_BASE: 100,
} as const;
```

### 3.2. Множитель опыта

Применяется ко ВСЕМ XP, полученным за действия этой шкалы.

```
M(S) = 0.25 + 0.75 × (S / 100)          при 0 ≤ S ≤ 100
M(S) = 1.00 + 0.50 × ((S - 100) / 20)   при 100 < S ≤ 120
```

| S | M |
|---|---|
| 0% | 0.25 |
| 50% | 0.625 |
| 80% | 0.85 |
| 100% | 1.00 |
| 120% | 1.50 |

### 3.3. Daily Score шкалы

Для каждого дня `d`: `s_d` в диапазоне 0..120.

```
s_d = routine_score + quest_bonus
```

**routine_score:**
```
Если день помечен PauseDay:
  routine_score = DAILY_POOL_XP
Иначе:
  routine_score = DAILY_POOL_XP × Σ(w_i × completed_i) / Σ(w_i)
  Где Σ по всем рутинным привычкам шкалы, активным в этот день.
```

**quest_bonus:**
```
quest_bonus = Σ QUEST_SCALE_BONUS[type] по всем quest,
              выполненным в этот день и привязанным к шкале
```

Кап: `s_d = min(s_d, SCALE_MAX)`.

### 3.4. Значение шкалы на сегодня

```
S_today = (s_{d-WINDOW_DAYS+1} + ... + s_{d-1} + s_d) / WINDOW_DAYS
```

Дефолт `WINDOW_DAYS = 7`.

**Проверка** (WINDOW_DAYS=7, полная рутина=100):

| Сценарий | Эффект |
|---|---|
| Всё ок неделю | S = 100% |
| Один пропуск | S ≈ 86% |
| Два подряд | S ≈ 71% |
| Неделя пропусков | S ≈ 0% |
| Месяц пропусков + неделя нормы | S = 100% |
| Один тяжёлый quest + всё остальное ок | S ≈ 103% |
| Регулярные quest + всё ок | S = 120% (кап) |

### 3.5. XP за действие

```
XP = base_xp × M(S_scale)
```

**Рутинная привычка** в момент CheckIn:
```
base_xp = w_i / Σ(w) × DAILY_POOL_XP
```

**Разовая задача** при завершении:
```
base_xp = QUEST_XP[type]
```

### 3.6. Общий XP и уровень

Общий XP = сумма всех начисленных XP. Никогда не теряется.

```
level = floor(sqrt(total_xp / LEVEL_BASE))
```

| XP | Level |
|---|---|
| 100 | 1 |
| 400 | 2 |
| 900 | 3 |
| 2500 | 5 |
| 10000 | 10 |

Уровень не откатывается. XP не тратится.

### 3.7. Веса рутинных привычек

`priority: 'important' | 'desirable'`.
Маппинг: `important → 2`, `desirable → 1`.

Нормализация внутри шкалы:
```
w_norm_i = w_i / Σ(w_j для всех рутинных привычек шкалы)
```

Вклад в daily_score = `w_norm_i × DAILY_POOL_XP`.

При добавлении новой привычки нормализация пересчитывается для
будущих дней. Прошлые не трогаются.

---

## 4. Сущности

### 4.1. Dream

```ts
interface Dream {
  id: string;
  title: string;
  description?: string;
  emoji?: string;              // 🎸 💪 💰 🚀
  startedAt: string;
  archivedAt?: string;
}
```

### 4.2. Milestone

```ts
type MilestoneType = 'trackable' | 'declarative';

interface Milestone {
  id: string;
  dreamId: string;
  title: string;
  type: MilestoneType;

  // trackable:
  current?: number;
  target?: number;

  // declarative:
  achievedAt?: string;

  createdAt: string;
  lastNudgeAt?: string;
  status: 'active' | 'achieved' | 'archived';
}
```

### 4.3. Achievement

```ts
interface Achievement {
  id: string;
  milestoneId: string;
  dreamId: string;
  achievedAt: string;
  note?: string;
  mediaUrl?: string;
}
```

### 4.4. Habit

```ts
type Priority = 'important' | 'desirable';
type Schedule =
  | { kind: 'daily' }
  | { kind: 'weekly'; days: (0|1|2|3|4|5|6)[] }
  | { kind: 'every'; nDays: number; startDate: string };

interface Habit {
  id: string;
  scaleId: ScaleId;
  title: string;
  priority: Priority;
  schedule: Schedule;
  milestoneId?: string;
  createdAt: string;
  archivedAt?: string;
}
```

### 4.5. Quest

```ts
type QuestType = 'decompose' | 'normal' | 'heavy';

interface Quest {
  id: string;
  scaleId: ScaleId;
  title: string;
  type: QuestType;
  milestoneId?: string;
  dueDate?: string;
  status: 'open' | 'done' | 'cancelled';
  completedAt?: string;
  createdAt: string;
}
```

### 4.6. CheckIn

```ts
interface CheckIn {
  id: string;
  habitId: string;
  date: string;                // ISO date
  createdAt: string;
}
```
Unique (habitId, date).

### 4.7. Reward + RewardLog

```ts
interface ScaleCondition {
  scaleId: ScaleId;
  minValue: number;
}

interface Reward {
  id: string;
  title: string;
  description?: string;
  conditions: ScaleCondition[];
  cooldownDays?: number;
  archivedAt?: string;
}

interface RewardLog {
  id: string;
  rewardId: string;
  openedAt: string;
  usedAt: string;
}
```

### 4.8. PauseDay

```ts
interface PauseDay {
  id: string;
  date: string;
  note: string;                // ОБЯЗАТЕЛЬНОЕ
}
```

### 4.9. ScaleId

```ts
type ScaleId = 'health' | 'finance' | 'career' | 'projects';
```

Шкалы — константы, не сущность.

---

## 5. Инварианты

Проверяются в тестах.

1. `Σ w_norm_i по рутине шкалы == 1` для активных на сегодня привычек.
2. `0 ≤ S_scale ≤ 120` для каждой шкалы в любой момент.
3. `M(S)` монотонно возрастает на [0, 120].
4. `total_xp` монотонно не убывает.
5. `level` монотонно не убывает.
6. Одна CheckIn на пару (habitId, date).
7. Achievement существует ⟺ Milestone.status == 'achieved'.
8. Reward открыт ⟺ все conditions выполнены по шкалам.
9. PauseDay.date ≤ сегодня.
10. Декомпозиция quest'а даёт меньше XP, чем его выполнение.

---

## 6. Жизненные сценарии

### 6.1. Хороший день
- Утро: 3 привычки Health (сон, вода, прогулка)
- День: 2 привычки Career
- Вечер: quest `normal` на Career
- Завтра: S Health = 100%, S Career = 103%
- XP Career × M(103) = ×1.075

### 6.2. Пропуск одного дня
- Не отметил сон. S Health: 100 → 86.
- XP следующего дня Health: × M(86) = ×0.895.
- Никаких «-50 XP». Просто daily_score = 0 у привычки.

### 6.3. Неделя пропусков
- S Health: 100 → 0. Множитель: × 0.25.
- Выбираться — неделю.
- Мгновенного восстановления нет.

### 6.4. Пауза (болезнь, военкомат, госпитализация)
- Отмечаешь PauseDay, пишешь: «Госпитализация по военкомату».
- daily_score = K для всех шкал.
- XP не начисляется.
- 21 день в больнице — ок, без лимита.
- В статистике месяца: «21 день паузы (68% времени)». Зеркало.

### 6.5. Достижение Trackable
- Milestone «100 битов», current = 99.
- Завершаешь quest, привязанный к milestone.
- `current += 1 → 100`. Auto: `status = 'achieved'`.
- Auto: создаётся Achievement.
- Модалка «Как это было?».

### 6.6. Достижение Declarative
- Milestone «Full Planche».
- Раз в 3 месяца nudge: «Ещё работаешь?».
- Однажды: «Достигнуто». Создаётся Achievement.

### 6.7. Открытие приза
- Reward «2 часа игр», conditions: Health ≥ 70, Career ≥ 70.
- S Health = 75, S Career = 72 → открыт.
- Играешь → «Использовано» → RewardLog.
- Завтра S Health = 68 → закрыт.

### 6.8. Восстановление после падения
- Две недели пропуска, S = 0.
- День 1: S = 14. День 3: S = 42. День 7: S = 100.
- XP: × 0.35 → × 0.5 → × 1.0.
- Цена — потерянное время + заниженный XP.

---

## 7. Что НЕ входит в MVP

- Социальные фичи.
- Синхронизация (только localStorage → затем mock API).
- Мобильное приложение.
- Импорт из других трекеров.
- AI-ассистент.
- Push-уведомления.
- Экспорт в PDF.
- Тёмная тема.
- **JournalEntry / дневник заметок.**
- **DailyReflection (3 вопроса в конце дня).**
- Emotion rating у Achievement.

---

## 8. FSD-раскладка

Слои сверху вниз. Зависимости только вниз.

```
src/
├── app/                          — провайдеры, роутер, глобальные стили
├── pages/
│   ├── dashboard/
│   ├── habits/
│   ├── quests/
│   ├── dreams/
│   ├── achievements/
│   ├── rewards/
│   └── settings/
├── widgets/
│   ├── character-sheet/
│   ├── today-board/
│   ├── shards-dashboard/         — 4 осколка + динамика
│   ├── dream-tree/
│   ├── achievement-gallery/
│   ├── reward-catalog/
│   └── activity-heatmap/
├── features/
│   ├── check-in-habit/
│   ├── complete-quest/
│   ├── decompose-quest/
│   ├── create-habit/
│   ├── create-quest/
│   ├── create-dream/
│   ├── create-milestone/
│   ├── mark-milestone-achieved/
│   ├── use-reward/
│   └── log-pause-day/
├── entities/
│   ├── character/
│   ├── scale/
│   ├── habit/
│   ├── quest/
│   ├── dream/
│   ├── milestone/
│   ├── achievement/
│   ├── reward/
│   ├── check-in/
│   └── pause-day/
└── shared/
    ├── api/
    ├── ui/
    ├── lib/
    │   ├── xp.ts
    │   ├── scales.ts
    │   ├── dates.ts
    │   └── invariants.ts
    ├── config/
    │   └── balance.ts
    └── styles/
```

**Правило:** куда положить код — спроси «это про одно (entity),
про действие (feature) или про композицию (widget)?». Место находится само.

---
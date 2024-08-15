# 🗺️ Интерактивная Карта Кампуса

Добро пожаловать в проект интерактивной карты кампуса! Этот проект позволяет визуализировать карту кампуса университета с возможностью отображения расписания занятий и других событий. 

![image](https://github.com/user-attachments/assets/584d69d3-6e73-4079-a9a8-492d77e4498e)

## 📦 Содержание

- [Запуск проекта](#🚀-запуск-проекта)
- [Конфигурация проекта](#⚙️-конфигурация-проекта)
- [Создание кастомного источника данных](#🛠️-создание-кастомного-источника-данных)
- [Дополнительная информация](#📚-дополнительная-информация)
- [Лицензия](#📄-лицензия)

## 🚀 Запуск проекта

### Требования

- Docker
- Docker Compose
- Node.js (для разработки)

### Шаги для запуска

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/0niel/map.git
   cd map
   ```

2. **Запуск в режиме разработки:**

   Если вы хотите запустить проект в режиме разработки, выполните следующие команды:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   После этого откройте [http://localhost:3000](http://localhost:3000) в вашем браузере, чтобы увидеть результат.

3. **Запуск с использованием Docker:**

   Для запуска проекта в Docker-контейнерах:

   ```bash
   docker-compose -f docker-compose.yml up -d
   docker-compose -f docker-compose.traefik.yml up -d
   ```

4. **Доступ к приложению:**

   Откройте браузер и перейдите по адресу `http://localhost:3000` для доступа к приложению.

## ⚙️ Конфигурация проекта

### Основной конфигурационный файл

Файл `config.ts` содержит базовую конфигурацию приложения. Вот пример содержания:

```typescript
const config: Config = {
  campuses: [
    {
      shortName: 'Сокол',
      description: 'Волоколамское шоссе, 11',
      floors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      initialFloor: 1,
      initialScale: 0.2,
    }
  ],

  svgMaps: {
    Floor1: '/svg-maps/corpus_b_2.svg',
    Floor2: '/svg-maps/corpus_b_3_floor_uncodified.svg',
    Floor3: '/svg-maps/corpus_b_4_floor.svg',
    Floor4: '/svg-maps/corpus_b_5_floor.svg',
    Floor5: '/svg-maps/corpus_b_6_floor.svg',
    Floor6: '/svg-maps/corpus_b_7_floor_uncodified.svg',
    Floor7: '/svg-maps/corpus_b_8_floor.svg',
    Floor8: '/svg-maps/corpus_b_9_floor.svg',
    Floor9: '/svg-maps/corpus_b_10_floor.svg',
    Floor10: '/svg-maps/corpus_b_11_floor.svg',
  },

  schedule: {
    defaultDataSource: 'rosbiotech'
  }
}
```

### Карты этажей

Каждая строка в объекте `svgMaps` указывает путь к SVG-файлу, представляющему карту определенного этажа. Например:

- **`Floor1: '/svg-maps/corpus_b_2.svg'`** указывает на карту первого этажа, которая должна находиться в директории `public/svg-maps` вашего проекта.

#### Что нужно сделать:

1. **Создайте карты этажей**: Подготовьте SVG-файлы для каждого этажа вашего кампуса.
2. **Загрузите SVG-файлы в проект**: Поместите эти файлы в папку `public/svg-maps`.
3. **Убедитесь, что конфигурация соответствует реальному расположению файлов**.

### Использование Traefik

Для маршрутизации и управления SSL используется Traefik. Конфигурация находится в файле `docker-compose.traefik.yml`.

## 🛠️ Создание кастомного источника данных

Чтобы создать кастомный источник данных для расписания, выполните следующие шаги:

1. **Создайте новый класс источника данных:**

   Пример: `custom-data-sources/your-custom-data-source.ts`.

   ```typescript
   import { DataSource } from '../data-source';
   import { LessonSchedulePart } from '../models/lesson-schedule-part';

   export class YourCustomDataSource implements DataSource {
     // Реализуйте методы источника данных
   }
   ```

2. **Обновите фабрику источников данных:**

   В файле `data-source-factory.ts` добавьте ваш новый источник:

   ```typescript
   export const createDataSource = (config: DataSourceConfig): DataSource => {
     switch (config.type) {
       case 'local':
         // ...
       case 'your_custom_type':
         const { YourCustomDataSource } = require('./custom-data-sources/your-custom-data-source');
         return new YourCustomDataSource(config.endpoint);
       default:
         throw new Error('Invalid data source type');
     }
   };
   ```

3. **Настройте конфигурацию:**

   Обновите `config.ts`, указав ваш новый тип источника данных:

   ```typescript
   schedule: {
     defaultDataSource: 'your_custom_type'
   }
   ```

## 📚 Дополнительная информация

### Использование движка

Этот движок используется для создания интерактивных карт кампусов в следующих проектах:

- [map.mirea.ru](https://map.mirea.ru) - Интерактивная карта кампуса Российского технологического университета МИРЭА.
- [map.rosbiotech.ru](https://map.rosbiotech.ru) - Интерактивная карта кампуса Российского биотехнологического университета.

### Next.js

Этот проект использует [Next.js](https://nextjs.org), популярный фреймворк для создания React-приложений.

### Ресурсы для изучения

- [Документация Next.js](https://nextjs.org/docs) - узнайте больше о функциях и API Next.js.
- [Интерактивный учебник по Next.js](https://nextjs.org/learn) - научитесь использовать Next.js через интерактивное обучение.

### Деплой на Vercel

Самый простой способ развернуть ваше Next.js приложение — это использовать [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) от создателей Next.js.

Ознакомьтесь с [документацией по деплою Next.js](https://nextjs.org/docs/deployment) для получения более подробной информации.

## 📄 Лицензия

Этот проект лицензирован под [GNU GPL v3](LICENSE).

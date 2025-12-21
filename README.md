This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Data Sync & APIs

This project includes utilities for fetching Weather and Calendar data.

### Configuration

Create a `.env.local` file with the following variables:

```env
# Weather (OpenWeatherMap)
OPENWEATHER_API_KEY=your_api_key_here

# Calendar (CalDAV / Baïkal)
CALDAV_URL=https://your-baikal-server/dav/calendars/user/calendar_name/
CALDAV_USERNAME=your_username
CALDAV_PASSWORD=your_password

# Development
USE_MOCK_DATA=false # Set to true to use offline mock data
```

### Usage

**Weather:**

```typescript
import { fetchWeather } from '@/lib/api/fetchWeather';

const data = await fetchWeather('London');
// or
const data = await fetchWeather({ lat: 51.5074, lon: -0.1278 });
```

**Calendar:**

```typescript
import { CalendarSync } from '@/lib/api/calendarSync';

const calendar = new CalendarSync();
const events = await calendar.getEvents(startDate, endDate);
```

### Testing

Run unit tests with:

```bash
npm test
```

## Deployment (Target Platform)

```bash
git pull
docker compose up -d --build
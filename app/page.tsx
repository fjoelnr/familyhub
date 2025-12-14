// app/page.tsx

import HubShell from "@/components/shell/HubShell";
import Section from "@/components/shell/Section";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";

const dummyWeather = {
  locationName: "München",
  temperature: 8,
  condition: "Bewölkt",
  icon: "cloudy",
};

const dummyCalendar = [
  {
    id: "1",
    title: "Familien-Meeting",
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    allDay: false,
    calendar: "Familie",
    source: "local",
  },
];

export default function Home() {
  return (
    <HubShell>
      <Section title="Wetter">
        <WeatherWidget data={dummyWeather} />
      </Section>

      <Section title="Kalender">
        <CalendarWidget events={dummyCalendar} />
      </Section>
    </HubShell>
  );
}

import { WeatherData } from "@/lib/contracts/weather";

export default function WeatherWidget({
    data,
}: {
    data: { locationName: string; temperature: number; condition: string } | null;
}) {
    if (!data) {
        return <div className="text-center">Lade Wetter…</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="text-3xl font-semibold">{data.locationName}</div>
            <div className="text-6xl font-bold">{data.temperature}°</div>
            <div className="text-xl">{data.condition}</div>
        </div>
    );
}


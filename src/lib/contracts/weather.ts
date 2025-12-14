export interface WeatherData {
    locationName: string;
    temperature: number;
    condition: string;
    icon: string;
    forecast?: Array<{
        date: string;
        high: number;
        low: number;
        condition: string;
        icon: string;
    }>;
}

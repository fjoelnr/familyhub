import { WeatherData } from './weather';
import { CalendarEvent } from './calendar';

export type WeatherResponse = WeatherData;

export type CalendarEventResponse = CalendarEvent;

export interface ApiError {
    error: string;
    details?: unknown;
}

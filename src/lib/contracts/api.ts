import { WeatherData } from './weather';
import { CalendarEvent } from './calendar';

export interface WeatherResponse extends WeatherData { }

export interface CalendarEventResponse extends CalendarEvent { }

export interface ApiError {
    error: string;
    details?: any;
}

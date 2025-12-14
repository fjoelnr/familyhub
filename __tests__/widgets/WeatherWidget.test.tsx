import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import { WeatherData } from '@/lib/contracts/weather';

// Mock data matching the WeatherData interface
const mockWeatherData: WeatherData = {
    locationName: 'Berlin',
    temperature: 22,
    condition: 'Sunny',
    icon: 'sun-icon', // Assuming string for icon based on contract
    forecast: []
};

describe('WeatherWidget', () => {
    it('renders loading state when data is null', () => {
        render(<WeatherWidget data={null} />);
        // Expect the loading text defined in the component
        expect(screen.getByText('Lade Wetter…')).toBeInTheDocument();
    });

    it('renders weather data correctly when provided', () => {
        render(<WeatherWidget data={mockWeatherData} />);

        // Check for location name
        expect(screen.getByText('Berlin')).toBeInTheDocument();

        // Check for temperature rendering (component adds °)
        expect(screen.getByText('22°')).toBeInTheDocument();

        // Check for condition text
        expect(screen.getByText('Sunny')).toBeInTheDocument();
    });
});

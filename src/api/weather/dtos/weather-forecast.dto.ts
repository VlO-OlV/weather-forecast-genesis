export class WeatherForecastDto {
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
}
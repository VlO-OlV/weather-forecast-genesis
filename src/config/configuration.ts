export default () => ({
	port: parseInt(process.env.PORT as string) || 3000,
	weatherApiKey: process.env.WEATHER_API_KEY,
});
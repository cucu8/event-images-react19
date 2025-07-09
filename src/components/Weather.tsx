import { useEffect, use, Suspense } from "react";
import { useParams } from "react-router-dom";

const KONUM = {
  latitude: 41.0082,
  longitude: 28.9784,
  mekanAdi: "Davet Mekanı",
};

const TARIH = "2024-06-10";

// Weather data fetcher using React 19's use hook
const fetchWeatherData = async () => {
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${KONUM.latitude}&longitude=${KONUM.longitude}&start_date=${TARIH}&end_date=${TARIH}&daily=temperature_2m_mean&timezone=Europe/Istanbul`
  );
  
  if (!response.ok) {
    throw new Error('Hava durumu alınamadı.');
  }
  
  const data = await response.json();
  return data.daily.temperature_2m_mean[0];
};

const WeatherContent = ({ weatherPromise }: { weatherPromise: Promise<number> }) => {
  const weather = use(weatherPromise);
  
  return (
    <div className="bg-white/80 rounded p-4 shadow text-black">
      <div>
        <b>Durum:</b> {`${weather}°C`}
      </div>
    </div>
  );
};

const Weather = () => {
  const { userId } = useParams<{ userId: string }>();
  const weatherPromise = fetchWeatherData();

  useEffect(() => {
    console.log("Weather userId:", userId);
  }, [userId]);

  return (
    <section id="hava" className="flex flex-col items-center my-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">
        Davet Günü Hava Durumu
      </h2>
      <Suspense fallback={
        <div className="bg-white/80 rounded p-4 shadow text-black">
          <div>Hava durumu yükleniyor...</div>
        </div>
      }>
        <WeatherContent weatherPromise={weatherPromise} />
      </Suspense>
    </section>
  );
};

export default Weather;

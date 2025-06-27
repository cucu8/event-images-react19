import { useEffect, useState } from "react";

const KONUM = {
  latitude: 41.0082,
  longitude: 28.9784,
  mekanAdi: "Davet Mekanı",
};

const TARIH = "2024-06-10";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${KONUM.latitude}&longitude=${KONUM.longitude}&start_date=${TARIH}&end_date=${TARIH}&daily=temperature_2m_mean&timezone=Europe/Istanbul`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWeather(data.daily.temperature_2m_mean[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Hava durumu alınamadı.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Hava durumu yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!weather) return <div>Veri yok.</div>;

  return (
    <section id="hava" className="flex flex-col items-center my-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">
        Davet Günü Hava Durumu
      </h2>
      <div className="bg-white/80 rounded p-4 shadow text-black">
        <div>
          <b>Durum:</b> {`${weather}°C`}
        </div>
      </div>
    </section>
  );
};

export default Weather;

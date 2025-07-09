import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface LocationData {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

const Konum = () => {
  const { userId } = useParams<{ userId: string }>();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapsUrl = locationData 
    ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
    : "";

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!userId) {
        setError("User ID bulunamadı");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/User/${userId}`);
        setLocationData(response.data);
        setError("");
      } catch (err) {
        console.error("Konum bilgisi alınırken hata:", err);
        setError("Konum bilgisi alınamadı");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [userId]);

  if (loading) {
    return (
      <section id="konum" className="flex flex-col items-center my-8 p-12">
        <h2 className="text-xl font-bold mb-4 text-indigo-900">Davet Yeri</h2>
        <div className="text-gray-600">Konum bilgisi yükleniyor...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="konum" className="flex flex-col items-center my-8 p-12">
        <h2 className="text-xl font-bold mb-4 text-indigo-900">Davet Yeri</h2>
        <div className="text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section id="konum" className="flex flex-col items-center my-8 p-12">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Davet Yeri</h2>
      {locationData && (
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white">{locationData.locationName}</h3>
            <p className="text-base font-bold text-white">{locationData.name}</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition mb-4"
          >
            Google Haritalar'da Aç
          </a>
        </>
      )}
    </section>
  );
};

export default Konum;

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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/User/${userId}`
        );
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
        <h2 className="text-4xl font-caveat font-bold mb-4 text-indigo-900">Davet Yeri</h2>
        <div className="text-gray-600">Konum bilgisi yükleniyor...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="konum" className="flex flex-col items-center my-8 p-12">
        <h2 className="text-4xl font-caveat font-bold mb-4 text-indigo-900">Davet Yeri</h2>
        <div className="text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section id="konum" className="flex flex-col items-center my-8 p-12">
      <h2 className="text-4xl font-bold mb-4 text-indigo-900">Davet Yeri</h2>
      {locationData && (
        <>
          <div className="text-center mb-4">
            <h3 className="text-xl font-satisfy font-bold text-white flex items-center justify-center gap-2">
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                  clipRule="evenodd"
                />
              </svg>
              {locationData.locationName}
            </h3>
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

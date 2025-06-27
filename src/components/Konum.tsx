import { useEffect } from "react";

const KONUM = {
  latitude: 41.0082, // Örnek: İstanbul
  longitude: 28.9784,
  mekanAdi: "Davet Mekanı",
};

const Konum = () => {
  const mapsUrl = `https://www.google.com/maps?q=${KONUM.latitude},${KONUM.longitude}`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    console.log("Konum userId:", userId);
  }, []);

  return (
    <section id="konum" className="flex flex-col items-center my-8 p-12">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Davet Yeri</h2>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition mb-4"
      >
        Google Haritalar'da Aç
      </a>
    </section>
  );
};

export default Konum;

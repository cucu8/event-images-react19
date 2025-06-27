const KONUM = {
  latitude: 41.0082, // Örnek: İstanbul
  longitude: 28.9784,
  mekanAdi: "Davet Mekanı",
};

const Konum = () => {
  const mapsUrl = `https://www.google.com/maps?q=${KONUM.latitude},${KONUM.longitude}`;

  return (
    <section id="konum" className="flex flex-col items-center my-8 p-12">
      <h2 className="text-xl font-bold mb-4 text-white">Davet Yeri</h2>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
      >
        Google Haritalar'da Aç
      </a>
      <p className="mt-2 text-white">{KONUM.mekanAdi}</p>
    </section>
  );
};

export default Konum;

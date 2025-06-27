import { useState, useEffect } from "react";

interface Yorum {
  isim: string;
  yorum: string;
  tarih: Date;
}

const dummyYorumlar: Yorum[] = Array.from({ length: 30 }, (_, i) => ({
  isim: `Kullanıcı ${i + 1}`,
  yorum: `Bu bir örnek yorumdur. Yorum numarası: ${i + 1}`,
  tarih: new Date(Date.now() - i * 1000 * 60 * 60), // Her biri 1 saat arayla geriye gitsin
}));

const Yorumlar = () => {
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [isim, setIsim] = useState("");
  const [yorum, setYorum] = useState("");

  useEffect(() => {
    setYorumlar(dummyYorumlar);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isim.trim() || !yorum.trim()) return;
    setYorumlar([{ isim, yorum, tarih: new Date() }, ...yorumlar]);
    setIsim("");
    setYorum("");
  };

  return (
    <section
      id="yorumlar"
      className="flex flex-col items-center my-8 w-full max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-white">Yorumlar</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-3 mb-6 border border-gray-200"
      >
        <input
          type="text"
          placeholder="Adınız"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <textarea
          placeholder="Yorumunuz"
          value={yorum}
          onChange={(e) => setYorum(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[80px]"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition self-end"
        >
          Gönder
        </button>
      </form>
      <div className="w-full flex flex-col gap-4 max-h-96 overflow-y-auto">
        {yorumlar.length === 0 && (
          <div className="text-white/80 text-center">Henüz yorum yok.</div>
        )}
        {yorumlar.map((y, i) => (
          <div
            key={i}
            className="bg-white/90 rounded-2xl shadow p-4 border border-gray-200"
          >
            <div className="font-semibold text-indigo-900">{y.isim}</div>
            <div className="text-gray-800 whitespace-pre-line">{y.yorum}</div>
            <div className="text-xs text-pink-500 mt-1">
              {y.tarih.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Yorumlar;

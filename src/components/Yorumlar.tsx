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
        className="w-full bg-white/80 rounded p-4 shadow mb-6 flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Adınız"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
        />
        <textarea
          placeholder="Yorumunuz"
          value={yorum}
          onChange={(e) => setYorum(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px] text-black placeholder-black"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition self-end"
        >
          Gönder
        </button>
      </form>
      <div className="w-full flex flex-col gap-4 max-h-96 overflow-y-auto">
        {yorumlar.length === 0 && (
          <div className="text-white/80 text-center">Henüz yorum yok.</div>
        )}
        {yorumlar.map((y, i) => (
          <div key={i} className="bg-white/90 rounded p-3 shadow">
            <div className="font-semibold text-black">{y.isim}</div>
            <div className="text-black whitespace-pre-line">{y.yorum}</div>
            <div className="text-xs text-black/60 mt-1">
              {y.tarih.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Yorumlar;

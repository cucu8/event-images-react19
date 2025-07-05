import { useState, useEffect, useActionState, useOptimistic, startTransition } from "react";

interface Yorum {
  id: string;
  isim: string;
  yorum: string;
  tarih: Date;
}

interface FormState {
  success: boolean;
  error: string;
}

const dummyYorumlar: Yorum[] = Array.from({ length: 30 }, (_, i) => ({
  id: `dummy-${i}`,
  isim: `Kullanıcı ${i + 1}`,
  yorum: `Bu bir örnek yorumdur. Yorum numarası: ${i + 1}`,
  tarih: new Date(Date.now() - i * 1000 * 60 * 60), // Her biri 1 saat arayla geriye gitsin
}));

const Yorumlar = () => {
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [optimisticYorumlar, addOptimisticYorum] = useOptimistic(
    yorumlar,
    (state: Yorum[], newYorum: Yorum) => [newYorum, ...state]
  );
  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState: FormState, formData: FormData): Promise<FormState> => {
      try {
        const isim = formData.get("isim") as string;
        const yorum = formData.get("yorum") as string;
        
        if (!isim.trim() || !yorum.trim()) {
          return { success: false, error: "Lütfen tüm alanları doldurun." };
        }

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newYorum: Yorum = {
          id: Date.now().toString(),
          isim: isim.trim(),
          yorum: yorum.trim(),
          tarih: new Date()
        };
        
        startTransition(() => {
          setYorumlar(prev => [newYorum, ...prev]);
        });
        
        return { success: true, error: "" };
      } catch (err) {
        return { success: false, error: "Yorum gönderilirken bir hata oluştu." };
      }
    },
    { success: false, error: "" }
  );

  useEffect(() => {
    setYorumlar(dummyYorumlar);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    console.log("Yorumlar userId:", userId);
  }, []);

  const handleSubmitWithOptimistic = (formData: FormData) => {
    const isim = formData.get("isim") as string;
    const yorum = formData.get("yorum") as string;
    
    if (!isim.trim() || !yorum.trim()) return;
    
    const optimisticYorum: Yorum = {
      id: `temp-${Date.now()}`,
      isim: isim.trim(),
      yorum: yorum.trim(),
      tarih: new Date()
    };
    
    addOptimisticYorum(optimisticYorum);
    formAction(formData);
  };

  return (
    <section
      id="yorumlar"
      className="flex flex-col items-center my-8 w-full max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-white">Yorumlar</h2>
      <form
        action={handleSubmitWithOptimistic}
        className="w-full bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-3 mb-6 border border-gray-200"
      >
        <input
          type="text"
          name="isim"
          placeholder="Adınız"
          required
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <textarea
          name="yorum"
          placeholder="Yorumunuz"
          required
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[80px]"
        />
        {formState.error && (
          <div className="text-red-600 font-medium text-sm">{formState.error}</div>
        )}
        {formState.success && (
          <div className="text-green-600 font-medium text-sm">Yorum başarıyla gönderildi!</div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition self-end disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
      <div className="w-full flex flex-col gap-4 max-h-96 overflow-y-auto">
        {optimisticYorumlar.length === 0 && (
          <div className="text-white/80 text-center">Henüz yorum yok.</div>
        )}
        {optimisticYorumlar.map((y) => (
          <div
            key={y.id}
            className={`bg-white/90 rounded-2xl shadow p-4 border border-gray-200 transition-opacity ${
              y.id.startsWith('temp-') ? 'opacity-70' : 'opacity-100'
            }`}
          >
            <div className="font-semibold text-indigo-900">{y.isim}</div>
            <div className="text-gray-800 whitespace-pre-line">{y.yorum}</div>
            <div className="text-xs text-pink-500 mt-1">
              {y.tarih.toLocaleString()}
              {y.id.startsWith('temp-') && (
                <span className="ml-2 text-gray-400">(Gönderiliyor...)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Yorumlar;

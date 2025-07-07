import {
  useState,
  useEffect,
  useActionState,
  useOptimistic,
  startTransition,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Comment {
  id: number;
  content: string;
  name: string;
  userId: string;
  userName: string;
}

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

const Yorumlar = () => {
  const { userId } = useParams<{ userId: string }>();
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [optimisticYorumlar, addOptimisticYorum] = useOptimistic(
    yorumlar,
    (state: Yorum[], newYorum: Yorum) => [newYorum, ...state]
  );
  const [formState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(
    async (prevState: FormState, formData: FormData): Promise<FormState> => {
      try {
        const isim = formData.get("isim") as string;
        const yorum = formData.get("yorum") as string;

        if (!isim?.trim() || !yorum?.trim()) {
          return { success: false, error: "Lütfen tüm alanları doldurun." };
        }

        if (!userId) {
          return { success: false, error: "Kullanıcı ID'si bulunamadı." };
        }

        // API'ye POST isteği gönder
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${apiUrl}/Comment`, {
          content: yorum.trim(),
          name: isim.trim(),
          userId: userId,
        });

        // Başarılı response'dan sonra yorumları yeniden yükle
        if (response.status === 200 || response.status === 201) {
          // Yorumları yeniden fetch et
          const commentsResponse = await axios.get(
            `${apiUrl}/Comment/user/${userId}`
          );
          if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
            const convertedComments: Yorum[] = commentsResponse.data.map(
              (comment: Comment) => ({
                id: comment.id.toString(),
                isim: comment.name,
                yorum: comment.content,
                tarih: new Date(),
              })
            );
            console.log(convertedComments);
            startTransition(() => {
              setYorumlar(convertedComments);
            });
          }
        }

        return { success: true, error: "" };
      } catch (err: unknown) {
        console.error("Yorum gönderilirken hata:", err);
        if (axios.isAxiosError(err)) {
          return {
            success: false,
            error: `Yorum gönderilirken hata: ${
              err.response?.status || "Bilinmeyen hata"
            }`,
          };
        }
        return {
          success: false,
          error: "Yorum gönderilirken bir hata oluştu.",
        };
      }
    },
    { success: false, error: "" }
  );

  useEffect(() => {
    const fetchComments = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/Comment/user/${userId}`);

        if (response.data && Array.isArray(response.data)) {
          // API verilerini Yorum formatına dönüştür
          const convertedComments: Yorum[] = response.data.map(
            (comment: Comment) => ({
              id: comment.id.toString(),
              isim: comment.name,
              yorum: comment.content,
              tarih: new Date(), // API'de tarih yoksa şu anki zamanı kullan
            })
          );
          setYorumlar(convertedComments);
        }
      } catch (err: unknown) {
        console.error("Yorumlar yüklenirken hata:", err);
        if (axios.isAxiosError(err)) {
          setError(
            `Yorumlar yüklenirken hata: ${
              err.response?.status || "Bilinmeyen hata"
            }`
          );
        } else {
          setError("Yorumlar yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [userId]);

  const handleSubmitWithOptimistic = (formData: FormData) => {
    const isim = formData.get("isim") as string;
    const yorum = formData.get("yorum") as string;

    if (!isim?.trim() || !yorum?.trim()) return;

    const optimisticYorum: Yorum = {
      id: `temp-${Date.now()}`,
      isim: isim.trim(),
      yorum: yorum.trim(),
      tarih: new Date(),
    };

    addOptimisticYorum(optimisticYorum);
    formAction(formData);

    // Form'u temizle
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  return (
    <section
      id="yorumlar"
      className="flex flex-col items-center my-8 w-full max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-white">Yorumlar</h2>

      {loading && (
        <div className="text-white/80 text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          Yorumlar yükleniyor...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
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
          <div className="text-red-600 font-medium text-sm">
            {formState.error}
          </div>
        )}
        {formState.success && (
          <div className="text-green-600 font-medium text-sm">
            Yorum başarıyla gönderildi!
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition self-end disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {isPending ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
      <div className="w-full flex flex-col gap-4 max-h-96 overflow-y-auto">
        {!loading && optimisticYorumlar.length === 0 && (
          <div className="text-white/80 text-center">Henüz yorum yok.</div>
        )}
        {optimisticYorumlar.map((y) => (
          <div
            key={y.id}
            className={`bg-white/90 rounded-2xl shadow p-4 border border-gray-200 transition-opacity ${
              y.id.startsWith("temp-") ? "opacity-70" : "opacity-100"
            }`}
          >
            <div className="font-semibold text-indigo-900">{y.isim}</div>
            <div className="text-gray-800 whitespace-pre-line">{y.yorum}</div>
            <div className="text-xs text-pink-500 mt-1">
              {y.tarih.toLocaleString()}
              {y.id.startsWith("temp-") && (
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

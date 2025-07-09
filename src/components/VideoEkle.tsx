import {
  useRef,
  useState,
  useEffect,
  useActionState,
  startTransition,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MAX_FILES = 1;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface FormState {
  success: boolean;
  error: string;
}

const VideoEkle = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      try {
        if (!userId) {
          return { success: false, error: "Kullanıcı ID bulunamadı." };
        }

        const files = formData.getAll("videos") as File[];
        if (files.length === 0) {
          return { success: false, error: "Video seçilmedi." };
        }

        // Upload each video individually
        for (const file of files) {
          const videoFormData = new FormData();
          videoFormData.append("videoFile", file);
          videoFormData.append("userId", userId);

          await axios.post(
            `${import.meta.env.VITE_API_URL}/Video?userId=${userId}`,
            videoFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        // Reset form after successful upload
        startTransition(() => {
          setVideos([]);
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.type = "";
            fileInputRef.current.type = "file";
          }
        });

        return { success: true, error: "" };
      } catch (err: unknown) {
        console.error("Video upload error:", err);
        if (axios.isAxiosError(err)) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Video yükleme sırasında bir hata oluştu.";
          return { success: false, error: errorMessage };
        }
        return {
          success: false,
          error: "Video yükleme sırasında bir hata oluştu.",
        };
      }
    },
    { success: false, error: "" }
  );

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    console.log("VideoEkle userId:", userId);
  }, [userId]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (!files) return;
    if (files.length > MAX_FILES) {
      setError(`Sadece ${MAX_FILES} video seçebilirsiniz.`);
      return;
    }

    // Check file size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setError(
          `Video dosyası ${MAX_FILE_SIZE / (1024 * 1024)}MB'dan büyük olamaz.`
        );
        return;
      }
    }

    const fileArr = Array.from(files);
    setSelectedFiles(fileArr);

    Promise.all(
      fileArr.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject();
            reader.readAsDataURL(file);
          })
      )
    )
      .then((base64Arr) => setVideos(base64Arr))
      .catch(() => setError("Bir hata oluştu. Lütfen tekrar deneyin."));
  };

  const handleReset = () => {
    startTransition(() => {
      setVideos([]);
      setSelectedFiles([]);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.type = "";
        fileInputRef.current.type = "file";
      }
    });
  };

  const handleRemove = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="videoekle" className="flex flex-col items-center my-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Video Yükle</h2>
      <form
        action={(formData) => {
          // Add selected files to FormData
          selectedFiles.forEach((file) => {
            formData.append("videos", file);
          });
          formAction(formData);
        }}
        className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200"
      >
        <div className="relative w-full flex flex-col items-center">
          <input
            id="video-sec"
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Video seç"
          />
          <label
            htmlFor="video-sec"
            className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-blue-400 hover:to-purple-500 transition text-center w-full"
          >
            Video Seç
          </label>
          {videos.length > 0 && (
            <span className="mt-2 text-sm text-gray-600">1 video seçildi</span>
          )}
        </div>
        {(error || formState.error) && (
          <div className="text-pink-600 font-medium text-sm">
            {error || formState.error}
          </div>
        )}
        {formState.success && (
          <div className="text-green-600 font-medium text-sm">
            Video başarıyla yüklendi!
          </div>
        )}
        {videos.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {videos.map((video, i) => (
              <div
                key={i}
                className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 shadow"
              >
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs text-red-600 hover:bg-red-100 hover:text-red-800 transition z-10"
                  aria-label="Videoyu kaldır"
                >
                  &#10005;
                </button>
                <video
                  src={video}
                  className="object-cover w-full h-full"
                  controls={false}
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/80 rounded-full p-2">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-emerald-400 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={videos.length === 0 || isPending}
          >
            {isPending ? "Yükleniyor..." : "Yükle"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-indigo-500 hover:to-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={(videos.length === 0 && !error) || isPending}
          >
            Sıfırla
          </button>
        </div>
      </form>
    </section>
  );
};

export default VideoEkle;

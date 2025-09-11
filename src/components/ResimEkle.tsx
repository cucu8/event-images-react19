import { useRef, useState, useActionState, startTransition } from "react";
import { useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
const MAX_FILES = 5;

interface FormState {
  success: boolean;
  error: string;
}

const ResimEkle = () => {
  const { userId } = useParams<{ userId: string }>();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(
    async (): Promise<FormState> => {
      try {
        if (!userId) {
          return { success: false, error: "Kullanıcı ID'si bulunamadı." };
        }

        if (!recaptchaToken) {
          return { success: false, error: "Doğrulama yapınız." };
        }

        const apiFormData = new FormData();

        apiFormData.append("userId", userId);
        apiFormData.append("recaptchaToken", recaptchaToken);
        selectedFiles.forEach((file) => {
          apiFormData.append("files", file);
        });

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/Image/upload`,
          {
            method: "POST",
            body: apiFormData,
          }
        );

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // API başarılı response döndüyse (200), JSON parse etmeye çalışmayalım
        // Çünkü API boş response dönebilir
        let result = null;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          result = await response.text();
        }

        console.log("Upload successful:", result);

        // Yükleme başarılı olduğunda seçili fotoğrafları sıfırla
        setRecaptchaToken(null);
        setImages([]);
        setSelectedFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return { success: true, error: "" };
      } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: "Yükleme sırasında bir hata oluştu." };
      }
    },
    { success: false, error: "" }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (!files) return;
    if (files.length > MAX_FILES) {
      setError(`En fazla ${MAX_FILES} fotoğraf seçebilirsiniz.`);
      return;
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
      .then((base64Arr) => setImages(base64Arr))
      .catch(() => setError("Bir hata oluştu. Lütfen tekrar deneyin."));
  };

  const handleReset = () => {
    startTransition(() => {
      setImages([]);
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
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecaptchaChange = (token: string) => {
    setRecaptchaToken(token);
  };

  return (
    <section id="resimekle" className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-dancing-script font-bold mb-4 text-indigo-900">Fotoğraf Yükle</h2>
      <form
        action={formAction}
        className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200"
      >
        <div className="relative w-full flex flex-col items-center">
          <input
            id="foto-sec"
            name="files"
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Fotoğraf seç"
          />
          <label
            htmlFor="foto-sec"
            className="cursor-pointer bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-pink-400 hover:to-indigo-500 transition text-center w-full"
          >
            Fotoğraf Seç
          </label>
          {images.length > 0 && (
            <span className="mt-2 text-sm text-gray-600">
              {images.length} fotoğraf seçildi
            </span>
          )}
        </div>
        {(error || formState.error) && (
          <div className="text-pink-600 font-medium text-sm">
            {error || formState.error}
          </div>
        )}
        {formState.success && (
          <div className="text-green-600 font-medium text-sm">
            Fotoğraflar başarıyla yüklendi!
          </div>
        )}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow"
              >
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs text-red-600 hover:bg-red-100 hover:text-red-800 transition z-10"
                  aria-label="Fotoğrafı kaldır"
                >
                  &#10005;
                </button>
                <img
                  src={img}
                  alt={`Yüklenen ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleFileChange} />
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleRecaptchaChange}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-emerald-400 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={images.length === 0 || isPending}
          >
            {isPending ? "Yükleniyor..." : "Yükle"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-indigo-500 hover:to-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={(images.length === 0 && !error) || isPending}
          >
            Sıfırla
          </button>
        </div>
      </form>
    </section>
  );
};

export default ResimEkle;

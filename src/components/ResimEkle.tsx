import { useRef, useState, useEffect } from "react";

const MAX_FILES = 5;

const ResimEkle = () => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    console.log("ResimEkle userId:", userId);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (!files) return;
    if (files.length > MAX_FILES) {
      setError(`En fazla ${MAX_FILES} fotoğraf seçebilirsiniz.`);
      return;
    }
    const fileArr = Array.from(files);
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
    setImages([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.type = "";
      fileInputRef.current.type = "file";
    }
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="resimekle" className="flex flex-col items-center my-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Fotoğraf Yükle</h2>
      <form className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200">
        <div className="relative w-full flex flex-col items-center">
          <input
            id="foto-sec"
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
        {error && (
          <div className="text-pink-600 font-medium text-sm">{error}</div>
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
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-emerald-400 hover:to-green-600 transition"
            disabled={images.length === 0}
          >
            Yükle
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-indigo-500 hover:to-pink-400 transition"
            disabled={images.length === 0 && !error}
          >
            Sıfırla
          </button>
        </div>
      </form>
    </section>
  );
};

export default ResimEkle;

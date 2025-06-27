import { useRef, useState } from "react";

const MAX_FILES = 5;

const ResimEkle = () => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="resimekle" className="flex flex-col items-center my-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Fotoğraf Yükle</h2>
      <form className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200">
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="block w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-500 file:to-pink-400 file:text-white hover:file:from-pink-400 hover:file:to-indigo-500 file:transition"
          aria-label="Fotoğraf seç"
        />
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

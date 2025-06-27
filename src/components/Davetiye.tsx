import { useEffect } from "react";

const Davetiye = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    console.log("Davetiye userId:", userId);
  }, []);

  return (
    <section id="davetiye" className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900 drop-shadow">
        Davetiye
      </h2>
      <div className="w-full max-w-md bg-white/90 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-200">
        <img
          src="/main.jpg"
          alt="Davetiye Fotoğrafı"
          className="w-full h-auto object-cover"
          style={{ maxHeight: 400 }}
        />
      </div>
    </section>
  );
};

export default Davetiye;

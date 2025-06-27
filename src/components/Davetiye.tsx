const Davetiye = () => {
  return (
    <section id="davetiye" className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4 text-white drop-shadow">
        Davetiye
      </h2>
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg border-4 border-white">
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

import { useParams } from "react-router-dom";

const Davetiye = () => {
  const { userId } = useParams<{ userId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <section id="davetiye" className="flex flex-col items-center my-8 pt-20">
      <h2 className="text-4xl font-dancing-script font-bold mb-4 text-indigo-900 drop-shadow">
        Davetiye
      </h2>
      <div className="w-full max-w-md bg-white/90 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-200">
        {userId ? (
          <img
            src={`${apiUrl}/InvitationImage/user/${userId}/image`}
            alt="Davetiye"
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/martini_glass.svg";
            }}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Davetiye yükleniyor...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Davetiye;

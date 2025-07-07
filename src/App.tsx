import { ErrorBoundary } from "react-error-boundary";
import { useParams, Navigate } from "react-router-dom";
import Davetiye from "./components/Davetiye";
import Konum from "./components/Konum";
import Navbar from "./components/Navbar";
import ResimEkle from "./components/ResimEkle";
import Weather from "./components/Weather";
import Yorumlar from "./components/Yorumlar";
import { useUserValidation } from "./hooks/useUserValidation";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
    <strong className="font-bold">Bir hata oluştu: </strong>
    <span className="block sm:inline">{error.message}</span>
    <button 
      onClick={resetErrorBoundary}
      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Tekrar Dene
    </button>
  </div>
);

function App() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading, error, userExists } = useUserValidation(userId);

  // Loading durumunda spinner göster
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı bulunamazsa NotFound'a yönlendir
  if (!userExists || error) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div
      className="h-screen w-screen"
      style={{
        backgroundImage: "url('/main.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <div className="h-full w-full p-2 sm:p-4 md:p-8 text-white overflow-auto">
        {/* Kullanıcı bilgilerini göster (geliştirme amaçlı) */}
        {user && (
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold mb-2">Kullanıcı Bilgileri:</h3>
            <p>ID: {user.id}</p>
            {user.name && <p>İsim: {user.name}</p>}
            {user.email && <p>Email: {user.email}</p>}
          </div>
        )}
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Davetiye />
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Weather />
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Konum />
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Yorumlar />
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ResimEkle />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;

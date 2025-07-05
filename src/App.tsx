import { ErrorBoundary } from "react";
import Davetiye from "./components/Davetiye";
import Konum from "./components/Konum";
import Navbar from "./components/Navbar";
import ResimEkle from "./components/ResimEkle";
import Weather from "./components/Weather";
import Yorumlar from "./components/Yorumlar";

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
        <ErrorBoundary fallback={ErrorFallback}>
          <Davetiye />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={ErrorFallback}>
          <Weather />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={ErrorFallback}>
          <Konum />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={ErrorFallback}>
          <Yorumlar />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={ErrorFallback}>
          <ResimEkle />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;

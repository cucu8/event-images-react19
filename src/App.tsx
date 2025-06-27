import Davetiye from "./components/Davetiye";
import Konum from "./components/Konum";
import Navbar from "./components/Navbar";
import ResimEkle from "./components/ResimEkle";
import Weather from "./components/Weather";
import Yorumlar from "./components/Yorumlar";

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
        <Davetiye />
        <Weather />
        <Konum />
        <Yorumlar />
        <ResimEkle />
      </div>
    </div>
  );
}

export default App;

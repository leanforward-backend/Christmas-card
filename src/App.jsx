import BirthdayCard from "./components/BirthdayCard";
import Gallery from "./components/Gallery";
import Goals from "./components/Goals";

function App() {
  return (
    <main className="bg-black min-h-screen text-white">
      <BirthdayCard />
      <Goals />
      <Gallery />
    </main>
  );
}

export default App;

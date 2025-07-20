import Leaderboard from "./components/LeaderBoard";
import MainUi from "./components/MainUi";
import "./App.css";

function App() {
  return (
    <div className="w-[100%] flex row  h-screen border">
      {/* SIDE BAR */}
      <Leaderboard />
      {/* MAIN  */}
      <MainUi />
    </div>
  );
}

export default App;

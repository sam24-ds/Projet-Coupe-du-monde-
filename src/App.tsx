import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";


function App(){
  return(
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/match/:id" element={<MatchDetailPage/>}/>
    </Routes>
  );
}

export default App;
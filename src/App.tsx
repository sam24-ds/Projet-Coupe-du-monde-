import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";

function App(){
  return(
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<HomePage/>} />
      <Route path="/match/:id" element={<MatchDetailPage/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
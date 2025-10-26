import type { Match } from "../types"
import MatchCard from "../components/MatchCard"
import { useState, useEffect } from "react";
import { getAllMatches } from "../services/apiService";


function HomePage() {
  // constante pour stocker les match recuperer depuis l'api
  const [matches, setMatches] = useState<Match[]>([]);
  //constante pour stocker l'etat du chargement des matchs
  const [isLoding, setIsLoding] = useState(true);
  //constante pour stocker les erreurs
  const [error, setError] = useState<string | null>(null);

useEffect(()=>{
  const loadMatches = async () =>{
    try{
      const matchesData = await getAllMatches();

      setMatches(matchesData);
      //console.log("donnee recu : ", data)

    } catch (err: any){
      setError(err.message);

    }finally{
      setIsLoding(false);
    }
  };

  loadMatches();
}, []);

if (isLoding){
  return <p style={{ textAlign: 'center', fontSize:'1.5em'}}> Chargements des matchs ...</p>
}

if (error){
  return <p style={{color: 'red', textAlign:'center'}}>Erreur: {error}</p>;
}


return (
  <div className="app-contener">
    <h1>Billeterie pour la coupe du monde 2026</h1>
    <main className="match-list">
      {matches.map((match)=>(
        <MatchCard key={match.id} match={match}/>
      ))}
    </main>
  </div>
)



}

export default HomePage

// Notre dictionnaire de traduction.

const teamNameTranslations: { [key: string]: string } = {
  // Europe
  "France": "France",
  "Germany": "Allemagne",
  "Spain": "Espagne",
  "Portugal": "Portugal",
  "England": "Angleterre",
  "Belgium": "Belgique",
  "Croatia": "Croatie",
  "Netherlands": "Pays-Bas",
  "Italy": "Italie",
  "Switzerland": "Suisse",
  
  // South America
  "Brazil": "Brésil",
  "Argentina": "Argentine",
  "Uruguay": "Uruguay",
  "Colombia": "Colombie",
  "Chile": "Chili",
  "Peru": "Pérou",
  "Ecuador": "Équateur",
  "Paraguay": "Paraguay",
  "Venezuela": "Venezuela",
  "Bolivia": "Bolivie",

  // North America
  "USA": "États-Unis",
  "Mexico": "Mexique",
  "Canada": "Canada",
  "Costa Rica": "Costa Rica",
  "Honduras": "Honduras",
  "Jamaica": "Jamaïque",
  "Panama": "Panama",
  "Cuba": "Cuba",
  "Trinidad and Tobago": "Trinité-et-Tobago",
  "El Salvador": "Salvador",


  // Africa
  "Morocco": "Maroc",
  "Senegal": "Sénégal",
  "Nigeria": "Nigéria",
  "Egypt": "Égypte",
  "Cameroon": "Cameroun",
  "Ghana": "Ghana",
  "Algeria": "Algérie",
  "Tunisia": "Tunisie",
  "Ivory Coast": "Côte d'Ivoire",
  "South Africa": "Afrique du Sud",

  
  // Asia
  "Japan": "Japon",
  "South Korea": "Corée du Sud",
  "Saudi Arabia": "Arabie Saoudite",
  "Iran": "Iran",
  "Qatar": "Qatar",
  "China": "Chine",
  "United Arab Emirates": "Émirats Arabes Unis",
  "Iraq": "Irak",
  "Syria": "Syrie",


  // Oceania
  "Australia": "Australie",
  "New Zealand": "Nouvelle-Zélande",
};

// Notre fonction traducteur.
// Elle prend un nom d'équipe en anglais et retourne la version française.
// Si aucune traduction n'est trouvée, elle retourne le nom original pour ne pas casser l'affichage.
export const translateTeamName = (englishName: string): string => {
  return teamNameTranslations[englishName] || englishName;
};
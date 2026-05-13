import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Dumbbell,
  GraduationCap,
  Home,
  ListChecks,
  LoaderCircle,
  PencilLine,
  RotateCcw,
  Search,
  Shuffle,
  SkipForward,
  Moon,
  Sparkles,
  Sun,
  Trophy,
} from "lucide-react";

const grammarTopics = [
  {
    id: "perfecto",
    title: "Pretérito perfecto",
    badge: "haber + participio",
    use: "Vergangenheit mit Bezug zu heute, dieser Woche, diesem Jahr oder Erfahrung.",
    formula: "he / has / ha / hemos / habéis / han + participio",
    signals: ["hoy", "esta semana", "ya", "todavía no", "nunca", "alguna vez", "últimamente"],
    examples: ["Hoy he hablado con Ana.", "Nunca he visto esta película.", "Todavía no hemos hecho los deberes."],
    table: [
      ["-ar", "hablar", "hablado"],
      ["-er", "comer", "comido"],
      ["-ir", "vivir", "vivido"],
    ],
  },
  {
    id: "indefinido",
    title: "Pretérito indefinido",
    badge: "abgeschlossen",
    use: "Abgeschlossene Handlung in der Vergangenheit, oft mit genauem Zeitpunkt.",
    formula: "hablé, hablaste, habló, hablamos, hablasteis, hablaron",
    signals: ["ayer", "anteayer", "anoche", "la semana pasada", "en 2020", "hace dos días", "de repente"],
    examples: ["Ayer fui al cine.", "El verano pasado viajamos a México.", "Hace dos años viví en Madrid."],
    table: [
      ["ser / ir", "fui, fuiste, fue, fuimos, fueron"],
      ["estar", "estuve, estuvo, estuvieron"],
      ["tener", "tuve, tuvo, tuvieron"],
      ["hacer", "hice, hizo, hicieron"],
      ["decir", "dije, dijo, dijeron"],
      ["ver", "vi, vio, vieron"],
    ],
  },
  {
    id: "imperfecto",
    title: "Pretérito imperfecto",
    badge: "früher / Beschreibung",
    use: "Gewohnheiten, Zustände, Kindheit, Hintergrund und Beschreibungen.",
    formula: "-ar: hablaba / -er/-ir: comía, vivía",
    signals: ["antes", "de niño/a", "cuando era pequeño/a", "siempre", "a menudo", "normalmente", "mientras"],
    examples: ["De niño jugaba al fútbol.", "Antes vivíamos en un pueblo.", "Cuando era pequeña veía dibujos animados."],
    table: [
      ["ser", "era, eras, era, éramos, erais, eran"],
      ["ir", "iba, ibas, iba, íbamos, ibais, iban"],
      ["ver", "veía, veías, veía, veíamos, veíais, veían"],
    ],
  },
  {
    id: "imperativo",
    title: "Imperativo afirmativo",
    badge: "Befehl / Bitte",
    use: "Bejahte Aufforderungen, Empfehlungen und Anweisungen. Pronomen werden angehängt.",
    formula: "di, haz, ve, pon, sal, sé, ten, ven",
    signals: ["por favor", "¡Ven aquí!", "dime", "dámelo", "tráemelo"],
    examples: ["Haz más deporte.", "Abre el libro.", "Dámelo, por favor."],
    table: [
      ["decir", "di"],
      ["hacer", "haz"],
      ["ir", "ve"],
      ["poner", "pon"],
      ["salir", "sal"],
      ["ser", "sé"],
      ["tener", "ten"],
      ["venir", "ven"],
    ],
  },
  {
    id: "preps",
    title: "Preposiciones",
    badge: "en / de / a / con",
    use: "Typische Verb-Preposition-Kombinationen auswendig können.",
    formula: "vivir en, hablar de, ir a, quedar con",
    signals: ["en", "de", "a", "con"],
    examples: ["Me ocupo de mi mascota.", "Quedo con mis amigos.", "Asisto a un curso."],
    table: [
      ["en", "vivir en, estar en, entrar en, inscribirse en, meterse en"],
      ["de", "hablar de, ocuparse de, quejarse de, depender de, acordarse de"],
      ["a", "ir a, llegar a, unirse a, asistir a, jugar a"],
      ["con", "hablar con, quedar con, contar con, llevarse bien con"],
    ],
  },
  {
    id: "relativos",
    title: "Pronombres relativos",
    badge: "que / quien / donde",
    use: "Sätze verbinden und Personen, Orte oder Aussagen genauer erklären.",
    formula: "que, quien, quienes, donde, lo que",
    signals: ["que", "quien", "quienes", "donde", "lo que"],
    examples: ["Es una ciudad que me gusta.", "La chica quien canta es española.", "No entiendo lo que dices."],
    table: [
      ["que", "der/die/das, welcher"],
      ["quien", "wer / der die, Singular"],
      ["quienes", "die, welche, Plural"],
      ["donde", "wo"],
      ["lo que", "das, was"],
    ],
  },
  {
    id: "desde",
    title: "desde / desde hace / hace",
    badge: "Zeitangaben",
    use: "Seit einem Zeitpunkt, seit einem Zeitraum oder vor einem Zeitraum ausdrücken.",
    formula: "desde + Zeitpunkt, desde hace + Zeitraum, hace + Zeitraum",
    signals: ["desde 1998", "desde hace cinco años", "hace dos días", "hasta"],
    examples: ["Vivo en Madrid desde 1998.", "Estudio español desde hace tres años.", "Llegué hace una hora."],
    table: [
      ["desde", "seit + Zeitpunkt"],
      ["desde hace", "seit + Zeitraum"],
      ["hace", "vor + Zeitraum"],
      ["hasta", "bis"],
    ],
  },
];

const grammarDetails = {
  perfecto: {
    signalGroups: [
      ["Heute / Zeitraum offen", "hoy, esta semana, este mes, este año"],
      ["Erfahrung / Ergebnis", "ya, todavía no, nunca, alguna vez, últimamente"],
    ],
    exceptions: [
      "Unregelmäßige Partizipien: hecho, dicho, visto, escrito, abierto, puesto, vuelto, roto.",
      "Mit reflexiven Verben steht das Pronomen vor haber: me he levantado.",
      "Bei ya / todavía no geht es oft um ein Ergebnis, das jetzt noch wichtig ist.",
    ],
  },
  indefinido: {
    signalGroups: [
      ["Abgeschlossener Zeitpunkt", "ayer, anteayer, anoche, el lunes, en 2020"],
      ["Abgeschlossener Zeitraum", "la semana pasada, el verano pasado, hace dos días"],
    ],
    exceptions: [
      "ser und ir haben dieselben Formen: fui, fuiste, fue, fuimos, fuisteis, fueron.",
      "Wichtige Verben haben eigene Stämme: tener -> tuv-, estar -> estuv-, hacer -> hic-/hiz-, decir -> dij-.",
      "Bei -car, -gar, -zar ändert sich die yo-Form: buscar -> busqué, llegar -> llegué, empezar -> empecé.",
    ],
  },
  imperfecto: {
    signalGroups: [
      ["Gewohnheit früher", "antes, siempre, a menudo, normalmente, cada verano"],
      ["Hintergrund / Beschreibung", "mientras, cuando era pequeño/a, de niño/a"],
    ],
    exceptions: [
      "Nur drei unregelmäßige Verben: ser -> era, ir -> iba, ver -> veía.",
      "Für eine einmalige, abgeschlossene Handlung nimmst du normalerweise indefinido.",
      "mientras steht sehr oft mit imperfecto, wenn Handlungen im Hintergrund laufen.",
    ],
  },
  imperativo: {
    signalGroups: [
      ["Aufforderung", "por favor, ahora, venga, vamos"],
      ["Pronomen angehängt", "dime, dámelo, tráemelo, levántate"],
    ],
    exceptions: [
      "Die wichtigsten unregelmäßigen tú-Formen: di, haz, ve, pon, sal, sé, ten, ven.",
      "Pronomen werden beim bejahten Imperativ angehängt: da + me + lo -> dámelo.",
      "Wenn die Betonung gleich bleiben muss, braucht das Verb oft einen Akzent.",
    ],
  },
  preps: {
    signalGroups: [
      ["Ort / hinein", "vivir en, estar en, entrar en"],
      ["Thema / kümmern", "hablar de, ocuparse de, quejarse de"],
      ["Richtung / Teilnahme", "ir a, llegar a, asistir a, unirse a"],
    ],
    exceptions: [
      "Prepositionen lassen sich nicht immer eins zu eins aus dem Deutschen übersetzen.",
      "jugar a steht bei Sportarten und Spielen: jugar al fútbol.",
      "Bei a + el entsteht al; bei de + el entsteht del.",
    ],
  },
  relativos: {
    signalGroups: [
      ["Sache / Person allgemein", "que"],
      ["Person nach Komma oder Präposition", "quien, quienes"],
      ["Ort / Aussage", "donde, lo que"],
    ],
    exceptions: [
      "que ist der Standard für Personen und Sachen: La chica que canta...",
      "quien/quienes benutzt du nur für Personen.",
      "lo que bedeutet 'das, was' und bezieht sich auf eine ganze Aussage oder Idee.",
    ],
  },
  desde: {
    signalGroups: [
      ["Seit Zeitpunkt", "desde 1998, desde el lunes"],
      ["Seit Zeitraum", "desde hace tres años, desde hace una semana"],
      ["Vor Zeitraum", "hace dos días, hace una hora"],
    ],
    exceptions: [
      "desde + Zeitpunkt: Vivo aquí desde 2020.",
      "desde hace + Zeitraum: Vivo aquí desde hace cuatro años.",
      "hace + Zeitraum bedeutet meistens 'vor': Llegué hace una hora.",
    ],
  },
};

const formationOverview = [
  {
    form: "Pretérito perfecto",
    build: "haber im presente + participio",
    endings: "he, has, ha, hemos, habéis, han + -ado / -ido",
    example: "Hoy he hablado con Ana.",
  },
  {
    form: "Pretérito indefinido",
    build: "Stamm + indefinido-Endung",
    endings: "-ar: -é, -aste, -ó, -amos, -asteis, -aron / -er-ir: -í, -iste, -ió, -imos, -isteis, -ieron",
    example: "Ayer viajé a Madrid.",
  },
  {
    form: "Pretérito imperfecto",
    build: "Stamm + imperfecto-Endung",
    endings: "-ar: -aba, -abas, -aba, -ábamos, -abais, -aban / -er-ir: -ía, -ías, -ía, -íamos, -íais, -ían",
    example: "Antes vivía en un pueblo.",
  },
  {
    form: "Imperativo afirmativo",
    build: "tú-Form als direkte Aufforderung",
    endings: "regulär: habla, come, vive / unregelmäßig: di, haz, ve, pon, sal, sé, ten, ven",
    example: "Haz los deberes.",
  },
];

const vocabUnits = [
  {
    id: "u1",
    title: "Unidad 1",
    subtitle: "Kleidung, Wetter, Einkaufen",
    color: "red",
    words: [
      ["la moda", "die Mode"], ["la marca", "die Marke"], ["la temporada", "die Saison"], ["la estación", "die Jahreszeit"],
      ["la primavera", "der Frühling"], ["el verano", "der Sommer"], ["el otoño", "der Herbst"], ["el invierno", "der Winter"],
      ["llevar", "anhaben, tragen"], ["la chaqueta", "die Jacke"], ["la bufanda", "der Schal"], ["el gorro", "die Haube"],
      ["la camiseta", "das T-Shirt"], ["la camisa", "das Hemd"], ["a cuadros", "kariert"], ["el sombrero", "der Hut"],
      ["el jersey", "der Pullover"], ["los pantalones", "die Hose"], ["los vaqueros", "die Jeans"], ["el vestido", "das Kleid"],
      ["el traje", "der Anzug"], ["la corbata", "die Krawatte"], ["el abrigo", "der Mantel"], ["las gafas de sol", "die Sonnenbrille"],
      ["la talla", "die Größe"], ["los probadores", "die Umkleidekabinen"], ["quedar", "passen"], ["probar", "anprobieren"],
      ["llover", "regnen"], ["nevar", "schneien"], ["nublado", "bewölkt"], ["soleado", "sonnig"],
      ["la tormenta", "das Gewitter"], ["el viento", "der Wind"], ["el cielo", "der Himmel"], ["desafortunadamente", "leider"],
      ["hacer senderismo", "wandern"], ["ir de compras", "einkaufen gehen"], ["tener razón", "Recht haben"], ["estar a favor de", "für etwas sein"],
      ["estar en contra de", "gegen etwas sein"],
    ],
  },
  {
    id: "u2",
    title: "Unidad 2",
    subtitle: "Land, Kultur, Reisen, Natur",
    color: "green",
    words: [
      ["el recuerdo", "die Erinnerung"], ["la plata", "das Silber"], ["la ruina", "die Ruine"], ["el templo", "der Tempel"],
      ["culinario/a", "kulinarisch"], ["el paisaje", "die Landschaft"], ["variado/a", "verschieden"], ["el maíz", "der Mais"],
      ["el yacimiento arqueológico", "der archäologische Fundort"], ["impresionante", "beeindruckend"], ["el/la indígena", "der Ureinwohner"],
      ["conquistar", "erobern"], ["levantar", "errichten"], ["la ciudad colonial", "die Kolonialstadt"], ["recorrer", "bereisen"],
      ["al contrario", "im Gegenteil"], ["unirse a", "sich anschließen an"], ["el pasado", "die Vergangenheit"], ["el presente", "die Gegenwart"],
      ["el desierto", "die Wüste"], ["el volcán", "der Vulkan"], ["la selva", "der Dschungel"], ["el río", "der Fluss"],
      ["la cascada", "der Wasserfall"], ["montañoso/a", "bergig"], ["el bosque", "der Wald"], ["la población", "die Bevölkerung"],
      ["la pobreza", "die Armut"], ["en vez de", "anstatt"], ["la paz", "der Frieden"], ["el cuento", "das Märchen"],
      ["ponerse nervioso/a", "nervös werden"], ["el recorrido", "der Rundgang"], ["tener lugar en", "stattfinden in"], ["depender", "abhängig sein von"],
      ["referirse a", "sich beziehen auf"], ["prohibir", "verbieten"], ["permitir", "erlauben"], ["perder el avión", "den Flug verpassen"],
      ["dormirse", "sich verschlafen"], ["la riqueza", "der Reichtum"], ["la fauna", "die Fauna"], ["la flora", "die Flora"],
      ["la mayoría", "die Mehrheit"], ["la hospitalidad", "die Gastfreundschaft"], ["descubrir", "entdecken"], ["fascinar", "faszinieren"],
      ["contar", "erzählen"], ["anteayer", "vorgestern"], ["delicioso/a", "köstlich"], ["voluntario/a", "freiwillig"],
    ],
  },
  {
    id: "u3",
    title: "Unidad 3",
    subtitle: "Freizeit, Sport, Hausarbeit, Alltag",
    color: "blue",
    words: [
      ["escalar", "klettern"], ["hacer parapente", "Paragleiten"], ["preparar", "vorbereiten"], ["pasarlo bomba", "viel Spaß haben"],
      ["el voleibol", "Volleyball"], ["No tengo ni idea.", "Ich habe keine Ahnung."], ["hacer los deberes", "die Hausübungen machen"],
      ["la mascota", "das Haustier"], ["salir con los amigos", "mit Freunden ausgehen"], ["ordenar la habitación", "aufräumen"],
      ["visitar a", "besuchen"], ["el monte", "der kleine Berg"], ["la escalada", "das Klettern"], ["el arnés", "der Klettergurt"],
      ["la cuerda", "das Seil"], ["el mosquetón", "der Karabinerhaken"], ["ser de confianza", "vertrauensvoll sein"], ["el reto", "die Herausforderung"],
      ["resolver", "lösen"], ["llevarse bien/mal", "sich gut/schlecht verstehen"], ["alegrarse de/por", "sich freuen über/auf"],
      ["hacer la maleta", "den Koffer packen"], ["planchar la ropa", "bügeln"], ["bajar la basura", "den Müll rausbringen"],
      ["fregar los platos", "das Geschirr abwaschen"], ["hacer la compra", "den Einkauf machen"], ["sacar al perro", "mit dem Hund spazieren gehen"],
      ["pasar la aspiradora", "staubsaugen"], ["cortar el césped", "den Rasen mähen"], ["quitar el polvo", "den Staub wischen"],
      ["poner la mesa", "den Tisch decken"], ["poner la lavadora", "die Waschmaschine einschalten"], ["hacer la cama", "das Bett machen"],
      ["compartir", "aufteilen / teilen"], ["odiar", "hassen"], ["a menudo", "oft"], ["ocuparse de", "sich kümmern um"],
      ["entre semana", "unter der Woche"], ["publicar", "veröffentlichen"], ["relacionado/a con", "im Zusammenhang mit"],
      ["las redes sociales", "die sozialen Netzwerke"], ["pasar el rato", "Zeit verbringen"], ["quejarse de", "sich beschweren"],
      ["limpiar las ventanas", "die Fenster putzen"], ["ganar", "verdienen / gewinnen"], ["generoso/a", "großzügig"], ["necesario/a", "nötig"],
      ["protegerse de", "sich schützen vor"], ["recuperarse de una enfermedad", "sich von einer Krankheit erholen"], ["el/la deportista", "der/die Sportler/in"],
      ["respetar", "respektieren"], ["ir en monopatín", "Skateboard fahren"], ["hacer esnórquel", "schnorcheln"], ["personalmente", "persönlich"],
    ],
  },
  {
    id: "u4",
    title: "Unidad 4",
    subtitle: "Kindheit / früher",
    color: "yellow",
    words: [
      ["la juventud", "die Jugend"], ["la infancia", "die Kindheit"], ["de niño/a", "als Kind"], ["cuando era pequeño/a", "als ich klein war"],
      ["antes", "früher"], ["en el pasado", "in der Vergangenheit"], ["jugar", "spielen"], ["jugar al fútbol", "Fußball spielen"],
      ["jugar con amigos", "mit Freunden spielen"], ["ir al parque", "in den Park gehen"], ["ver dibujos animados", "Zeichentrickfilme schauen"],
      ["tener miedo", "Angst haben"], ["ser tímido/a", "schüchtern sein"], ["ser travieso/a", "frech sein"], ["ser tranquilo/a", "ruhig sein"],
      ["portarse bien", "sich gut benehmen"], ["portarse mal", "sich schlecht benehmen"], ["echar de menos", "vermissen"], ["recordar", "sich erinnern"],
      ["crecer", "aufwachsen / wachsen"], ["vivir", "wohnen / leben"], ["ir al colegio", "in die Schule gehen"], ["hacer excursiones", "Ausflüge machen"],
    ],
  },
  {
    id: "travel",
    title: "Zusatz",
    subtitle: "Reisen und Länder",
    color: "purple",
    words: [
      ["viajar", "reisen"], ["el viaje", "die Reise"], ["las vacaciones", "die Ferien"], ["el país", "das Land"],
      ["la ciudad", "die Stadt"], ["el pueblo", "das Dorf"], ["el hotel", "das Hotel"], ["el alojamiento", "die Unterkunft"],
      ["el aeropuerto", "der Flughafen"], ["la estación de trenes", "der Bahnhof"], ["el billete", "das Ticket"], ["reservar", "reservieren"],
      ["visitar", "besuchen"], ["conocer", "kennenlernen / kennen"], ["probar comida típica", "typisches Essen probieren"],
      ["sacar fotos", "Fotos machen"], ["comprar recuerdos", "Souvenirs kaufen"], ["hacer una excursión", "einen Ausflug machen"],
      ["informarse sobre", "sich informieren über"], ["buscar información", "Informationen suchen"], ["preguntar por", "fragen nach"],
      ["la capital", "die Hauptstadt"], ["la moneda", "die Währung"], ["el idioma", "die Sprache"], ["los habitantes", "die Einwohner"],
      ["los monumentos", "die Sehenswürdigkeiten"],
    ],
  },
];

const drills = [
  { type: "fill", topic: "perfecto", prompt: "Hoy yo ___ (hacer) los deberes.", answer: "he hecho", hint: "haber yo + Partizip" },
  { type: "fill", topic: "perfecto", prompt: "Nosotros todavía no ___ (ver) la película.", answer: "hemos visto", hint: "haber nosotros + visto" },
  { type: "fill", topic: "indefinido", prompt: "Ayer ella ___ (ir) al cine.", answer: "fue", hint: "ser/ir im indefinido" },
  { type: "fill", topic: "indefinido", prompt: "La semana pasada yo ___ (tener) un examen.", answer: "tuve", hint: "tener -> tuv-" },
  { type: "fill", topic: "imperfecto", prompt: "De niño nosotros ___ (ir) al parque todos los días.", answer: "íbamos", hint: "ir im imperfecto" },
  { type: "fill", topic: "imperfecto", prompt: "Antes mi hermana ___ (ser) muy tímida.", answer: "era", hint: "ser im imperfecto" },
  { type: "choice", topic: "desde", prompt: "Ich lerne seit drei Jahren Spanisch.", answer: "Estudio español desde hace tres años.", options: ["Estudio español desde hace tres años.", "Estudio español hace tres años.", "Estudio español desde tres años."] },
  { type: "choice", topic: "preps", prompt: "Welche Präposition passt? ocuparse ___ la mascota", answer: "de", options: ["de", "en", "con"] },
  { type: "choice", topic: "relativos", prompt: "Madrid es una ciudad ___ me gusta mucho.", answer: "que", options: ["que", "quien", "lo que"] },
  { type: "fill", topic: "imperativo", prompt: "___ (hacer, tú) más deporte.", answer: "haz", hint: "unregelmäßiger tú-Imperativ" },
  { type: "fill", topic: "imperativo", prompt: "Da + me + lo = ___", answer: "dámelo", hint: "Pronomen anhängen, Akzent setzen" },
];

const writingPrompts = [
  {
    title: "Blogeintrag: Freizeit",
    task: "Schreibe 100-130 Wörter über deine Lieblingsaktivitäten und Sport. Verwende mindestens drei Zeitformen.",
    starters: ["Hola a todos", "Hoy quiero hablar de...", "En mi opinión...", "Además...", "¿Y vosotros? ¿Qué pensáis?"],
  },
  {
    title: "Kommentar: Reisen",
    task: "Kommentiere eine Reise nach Mexiko oder Spanien. Nenne Land, Sehenswürdigkeiten, Essen und deine Meinung.",
    starters: ["En esta entrada voy a escribir sobre...", "Por ejemplo...", "Para mí, lo más importante es...", "En resumen..."],
  },
  {
    title: "Kindheit",
    task: "Beschreibe, wie du früher warst und was du als Kind gemacht hast. Nutze das imperfecto.",
    starters: ["Cuando era pequeño/a...", "Antes...", "Siempre...", "A menudo...", "Echo de menos..."],
  },
];

const normalizeStrict = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[!?.\u00a1\u00bf]/g, "")
    .replace(/\s+/g, " ");

const normalize = (value) =>
  normalizeStrict(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const wordKey = (word) => `${word.unitId}:${word.es}`;

function App() {
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("spanisch-theme") || "light");
  const [unitId, setUnitId] = useState("all");
  const [query, setQuery] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnQueue, setLearnQueue] = useState([]);
  const [learnAnswer, setLearnAnswer] = useState("");
  const [learnFeedback, setLearnFeedback] = useState(null);
  const [missedKeys, setMissedKeys] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [writingTexts, setWritingTexts] = useState({});
  const [writingReviews, setWritingReviews] = useState({});
  const [reviewingPrompt, setReviewingPrompt] = useState(null);
  const [progress, setProgress] = useState(() => {
    const stored = localStorage.getItem("spanisch-progress");
    return stored ? JSON.parse(stored) : { correct: 0, attempts: 0, learned: [] };
  });

  useEffect(() => {
    localStorage.setItem("spanisch-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("spanisch-theme", theme);
  }, [theme]);

  const allWords = useMemo(
    () => vocabUnits.flatMap((unit) => unit.words.map(([es, de]) => ({ es, de, unit: unit.title, unitId: unit.id }))),
    []
  );

  const filteredWords = useMemo(() => {
    return allWords.filter((word) => {
      const matchesUnit = unitId === "all" || word.unitId === unitId;
      const matchesQuery = `${word.es} ${word.de}`.toLowerCase().includes(query.toLowerCase());
      return matchesUnit && matchesQuery;
    });
  }, [allWords, query, unitId]);

  useEffect(() => {
    setLearnQueue(filteredWords.map(wordKey));
    setLearnAnswer("");
    setLearnFeedback(null);
    setMissedKeys([]);
  }, [filteredWords]);

  const activeCard = filteredWords[cardIndex % Math.max(filteredWords.length, 1)];
  const learnWord = filteredWords.find((word) => wordKey(word) === learnQueue[0]);
  const learnedThisRound = Math.max(filteredWords.length - learnQueue.length, 0);
  const score = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;

  function nextCard() {
    setFlipped(false);
    setCardIndex((index) => (index + 1) % Math.max(filteredWords.length, 1));
  }

  function shuffleCard() {
    setFlipped(false);
    setCardIndex(Math.floor(Math.random() * Math.max(filteredWords.length, 1)));
  }

  function markKnown() {
    if (!activeCard) return;
    const key = wordKey(activeCard);
    setProgress((old) => ({ ...old, learned: [...new Set([...old.learned, key])] }));
    nextCard();
  }

  function restartLearnMode() {
    setLearnQueue(filteredWords.map(wordKey));
    setLearnAnswer("");
    setLearnFeedback(null);
    setMissedKeys([]);
  }

  function moveCurrentToEnd(status) {
    if (!learnWord) return;

    const key = wordKey(learnWord);
    setMissedKeys((old) => [...new Set([...old, key])]);
    setLearnQueue((old) => (old.length > 1 ? [...old.slice(1), old[0]] : old));
    setLearnAnswer("");
    setLearnFeedback({
      status,
      text:
        status === "skipped"
          ? `Übersprungen. Die richtige Antwort wäre: ${learnWord.es}`
          : `Noch nicht. Richtig wäre: ${learnWord.es}. Die Vokabel kommt am Schluss nochmal.`,
    });
  }

  function submitLearnAnswer(event) {
    event.preventDefault();
    if (!learnWord) return;

    const isCorrect = normalize(learnAnswer) === normalize(learnWord.es);
    const key = wordKey(learnWord);

    if (isCorrect) {
      setLearnQueue((old) => old.slice(1));
      setLearnAnswer("");
      setLearnFeedback({ status: "correct", text: `Richtig: ${learnWord.es}` });
      setProgress((old) => ({ ...old, learned: [...new Set([...old.learned, key])] }));
      return;
    }

    moveCurrentToEnd("wrong");
  }

  function submitQuiz(answer) {
    const drill = drills[quizIndex % drills.length];
    const value = answer ?? quizAnswer;
    const ok = normalize(value) === normalize(drill.answer);
    const exact = normalizeStrict(value) === normalizeStrict(drill.answer);
    setFeedback({ status: ok ? "correct" : "wrong", missingMark: ok && !exact });
    setProgress((old) => ({ ...old, attempts: old.attempts + 1, correct: old.correct + (ok ? 1 : 0) }));
  }

  function nextQuiz() {
    setFeedback(null);
    setQuizAnswer("");
    setQuizIndex((index) => (index + 1) % drills.length);
  }

  function updateWritingText(title, value) {
    setWritingTexts((old) => ({ ...old, [title]: value }));
  }

  async function reviewWriting(prompt) {
    const text = (writingTexts[prompt.title] || "").trim();

    if (text.length < 20) {
      setWritingReviews((old) => ({
        ...old,
        [prompt.title]: { type: "error", text: "Schreibe zuerst ein paar Sätze, damit die Korrektur sinnvoll ist." },
      }));
      return;
    }

    setReviewingPrompt(prompt.title);
    setWritingReviews((old) => ({ ...old, [prompt.title]: null }));

    try {
      const response = await fetch("/api/correct-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt.title,
          task: prompt.task,
          text,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : {};

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Die Korrektur-API ist lokal nicht erreichbar. Starte die App mit Vercel Dev oder deploye sie mit GROQ_API_KEY."
        );
      }

      setWritingReviews((old) => ({ ...old, [prompt.title]: { type: "success", text: data.feedback } }));
    } catch (error) {
      setWritingReviews((old) => ({ ...old, [prompt.title]: { type: "error", text: error.message } }));
    } finally {
      setReviewingPrompt(null);
    }
  }

  const drill = drills[quizIndex % drills.length];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">ES</span>
          <div>
            <strong>Spanisch Trainer</strong>
            <small>Schularbeit kompakt</small>
          </div>
        </div>
        <nav>
          {[
            ["home", Home, "Übersicht"],
            ["grammar", BookOpen, "Grammatik"],
            ["vocab", GraduationCap, "Vokabeln"],
            ["practice", Dumbbell, "Übungen"],
            ["writing", PencilLine, "Schreiben"],
            ["exam", Trophy, "Prüfungsmodus"],
          ].map(([id, Icon, label]) => (
            <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)} title={label}>
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">Lernübersicht aus deinem Notion-Stoff</p>
            <h1>Spanisch Schularbeit</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
              type="button"
              aria-label={theme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
              title={theme === "dark" ? "Hell" : "Dunkel"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === "dark" ? "Hell" : "Dunkel"}</span>
            </button>
            <div className="score-card">
              <CheckCircle2 size={20} />
              <div>
                <strong>{score}%</strong>
                <small>{progress.correct}/{progress.attempts} richtig</small>
              </div>
            </div>
          </div>
        </header>

        {active === "home" && (
          <section className="view-grid">
            <div className="hero-panel">
              <div>
                <p className="eyebrow">Trainingsplan</p>
                <h2>Heute: Zeiten unterscheiden, Vokabeln aktiv abrufen, Blog schreiben.</h2>
              </div>
              <div className="hero-actions">
                <button className="primary" onClick={() => setActive("practice")}>
                  <Dumbbell size={18} /> Üben starten
                </button>
                <button onClick={() => setActive("vocab")}>
                  <Shuffle size={18} /> Karteikarten
                </button>
              </div>
            </div>

            <div className="stats-grid">
              <Metric label="Vokabeln" value={allWords.length} />
              <Metric label="Grammatikthemen" value={grammarTopics.length} />
              <Metric label="Gelernte Karten" value={progress.learned.length} />
              <Metric label="Quizfragen" value={drills.length} />
            </div>

            <div className="section-title">
              <h2>Mini-Checkliste</h2>
            </div>
            <div className="checklist">
              {[
                "perfecto, indefinido und imperfecto unterscheiden",
                "unregelmäßige Verben im indefinido können",
                "ir, ser, ver im imperfecto können",
                "Imperativo afirmativo mit Pronomen können",
                "desde / desde hace / hace richtig verwenden",
                "Blogeintrag mit Einleitung, Hauptteil und Schluss schreiben",
                "Vokabeln zu Freizeit, Sport, Hausarbeit, Reisen, Länderinfo und Kindheit lernen",
              ].map((item) => (
                <label key={item}>
                  <input type="checkbox" /> <span>{item}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {active === "grammar" && (
          <section>
            <div className="section-title">
              <h2>Grammatik kompakt</h2>
              <p>Regeln, Signalwörter, Beispiele und typische Formen.</p>
            </div>
            <div className="formation-panel">
              <div className="card-head">
                <h3>Bildung der verschiedenen Formen</h3>
                <span>Übersicht</span>
              </div>
              <div className="table-wrap">
                <table className="formation-table">
                  <thead>
                    <tr>
                      <th>Form</th>
                      <th>Bildung</th>
                      <th>Endungen / Merkhilfe</th>
                      <th>Beispiel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formationOverview.map((row) => (
                      <tr key={row.form}>
                        <td><strong>{row.form}</strong></td>
                        <td>{row.build}</td>
                        <td>{row.endings}</td>
                        <td>{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grammar-grid">
              {grammarTopics.map((topic) => {
                const details = grammarDetails[topic.id];
                return (
                <article className="grammar-card" key={topic.id}>
                  <div className="card-head">
                    <h3>{topic.title}</h3>
                    <span>{topic.badge}</span>
                  </div>
                  <p>{topic.use}</p>
                  <strong>{topic.formula}</strong>
                  <div className="chips">
                    {topic.signals.map((signal) => (
                      <span key={signal}>{signal}</span>
                    ))}
                  </div>
                  {details?.signalGroups && (
                    <div className="signal-box">
                      <h4>Signalwörter</h4>
                      {details.signalGroups.map(([label, text]) => (
                        <p key={label}><strong>{label}:</strong> {text}</p>
                      ))}
                    </div>
                  )}
                  {details?.exceptions && (
                    <div className="exception-box">
                      <h4>Ausnahmen & Stolperstellen</h4>
                      <ul>
                        {details.exceptions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul>
                    {topic.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                  <div className="table-wrap">
                    <table className="mini-table">
                      <tbody>
                        {topic.table.map((row) => (
                          <tr key={row.join("-")}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
                );
              })}
            </div>
          </section>
        )}

        {active === "vocab" && (
          <section>
            <div className="section-title">
              <h2>Vokabeltrainer</h2>
              <p>Suchen, filtern, Karteikarten drehen und als gelernt markieren.</p>
            </div>
            <div className="tool-row">
              <label className="searchbox">
                <Search size={18} />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setCardIndex(0); }} placeholder="Vokabel suchen..." />
              </label>
              <select value={unitId} onChange={(e) => { setUnitId(e.target.value); setCardIndex(0); }}>
                <option value="all">Alle Einheiten</option>
                {vocabUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.title} - {unit.subtitle}</option>
                ))}
              </select>
            </div>

            <div className="trainer-layout">
              <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)}>
                {activeCard ? (
                  <>
                    <small>{activeCard.unit}</small>
                    <strong>{flipped ? activeCard.de : activeCard.es}</strong>
                    <span>{flipped ? "Deutsch" : "Español"}</span>
                  </>
                ) : (
                  <strong>Keine Treffer</strong>
                )}
              </div>
              <div className="trainer-actions">
                <button onClick={() => setFlipped((value) => !value)}><RotateCcw size={18} /> Umdrehen</button>
                <button onClick={shuffleCard}><Shuffle size={18} /> Zufällig</button>
                <button className="primary" onClick={markKnown}><CheckCircle2 size={18} /> Kann ich</button>
              </div>
              <div className="learn-mode">
                <div className="card-head">
                  <div>
                    <h3>Quizlet-Modus</h3>
                    <p>Tippe die spanische Vokabel. Falsche und geskippten Karten kommen am Schluss nochmal.</p>
                  </div>
                  <span>{learnQueue.length} offen</span>
                </div>
                <div className="learn-stats">
                  <span>{learnedThisRound} geschafft</span>
                  <span>{missedKeys.length} wiederholen</span>
                  <span>{filteredWords.length} in dieser Runde</span>
                </div>
                {learnWord ? (
                  <>
                    <div className="learn-prompt">
                      <small>{learnWord.unit}</small>
                      <strong>{learnWord.de}</strong>
                      <span>Deutsch → Español</span>
                    </div>
                    <form className="learn-form" onSubmit={submitLearnAnswer}>
                      <input
                        value={learnAnswer}
                        onChange={(event) => setLearnAnswer(event.target.value)}
                        placeholder="Spanische Vokabel eingeben..."
                      />
                      <button className="primary" type="submit"><CheckCircle2 size={18} /> Prüfen</button>
                      <button type="button" onClick={() => moveCurrentToEnd("skipped")}><SkipForward size={18} /> Skippen</button>
                    </form>
                  </>
                ) : (
                  <div className="learn-complete">
                    <strong>Runde geschafft.</strong>
                    <span>Alle sichtbaren Vokabeln sind durch.</span>
                  </div>
                )}
                {learnFeedback && (
                  <div className={`feedback ${learnFeedback.status === "correct" ? "correct" : "wrong"}`}>
                    {learnFeedback.text}
                  </div>
                )}
                <button type="button" onClick={restartLearnMode}><RotateCcw size={18} /> Runde neu starten</button>
              </div>
              <div className="word-list">
                {filteredWords.slice(0, 80).map((word) => (
                  <div key={`${word.unitId}-${word.es}`}>
                    <span>{word.es}</span>
                    <small>{word.de}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {active === "practice" && (
          <section>
            <div className="section-title">
              <h2>Interaktive Übungen</h2>
              <p>Lückentexte und Multiple Choice zu Grammatik und Signalwörtern.</p>
            </div>
            <div className="quiz-card">
              <div className="card-head">
                <span>Frage {quizIndex + 1} von {drills.length}</span>
                <span>{grammarTopics.find((topic) => topic.id === drill.topic)?.title}</span>
              </div>
              <h3>{drill.prompt}</h3>
              {drill.type === "choice" ? (
                <div className="choice-grid">
                  {drill.options.map((option) => (
                    <button key={option} onClick={() => submitQuiz(option)}>{option}</button>
                  ))}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); submitQuiz(); }}>
                  <input value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} placeholder="Antwort eingeben" />
                  <button className="primary" type="submit">Prüfen</button>
                </form>
              )}
              {feedback && (
                <div className={`feedback ${feedback.status}`}>
                  {feedback.status === "correct"
                    ? feedback.missingMark
                      ? `Gilt. Eigentlich gehört der Akzent oder das spanische Zeichen hinein: ${drill.answer}`
                      : "Richtig."
                    : `Noch nicht. Lösung: ${drill.answer}`}
                  {drill.hint && <small>Tipp: {drill.hint}</small>}
                </div>
              )}
              <button onClick={nextQuiz}>Nächste Frage</button>
            </div>
          </section>
        )}

        {active === "writing" && (
          <section>
            <div className="section-title">
              <h2>Schreibtraining</h2>
              <p>Blogeintrag, Kommentar und Kindheitstext mit Formulierungshilfen.</p>
            </div>
            <div className="writing-grid">
              {writingPrompts.map((prompt) => (
                <article className="writing-card" key={prompt.title}>
                  <h3>{prompt.title}</h3>
                  <p>{prompt.task}</p>
                  <div className="chips">
                    {prompt.starters.map((starter) => <span key={starter}>{starter}</span>)}
                  </div>
                  <textarea
                    placeholder="Schreibe hier deinen Text..."
                    rows={8}
                    value={writingTexts[prompt.title] || ""}
                    onChange={(event) => updateWritingText(prompt.title, event.target.value)}
                  />
                  <div className="writing-actions">
                    <button
                      className="primary"
                      type="button"
                      onClick={() => reviewWriting(prompt)}
                      disabled={reviewingPrompt === prompt.title}
                    >
                      {reviewingPrompt === prompt.title ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
                      {reviewingPrompt === prompt.title ? "Korrigiere..." : "Mit Groq korrigieren"}
                    </button>
                  </div>
                  {writingReviews[prompt.title] && (
                    <div className={`ai-review ${writingReviews[prompt.title].type}`}>
                      {writingReviews[prompt.title].text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {active === "exam" && (
          <section>
            <div className="section-title">
              <h2>Prüfungsmodus</h2>
              <p>Ein kompakter Durchlauf wie vor der Schularbeit.</p>
            </div>
            <div className="exam-grid">
              {[
                ["10 min", "Vokabel-Sprint", "20 Karten zufällig, Spanisch nach Deutsch und Deutsch nach Spanisch."],
                ["15 min", "Zeiten-Mix", "Entscheide perfecto, indefinido oder imperfecto und bilde die richtige Form."],
                ["10 min", "Präpositionen & Relativpronomen", "en, de, a, con sowie que, quien, donde, lo que."],
                ["25 min", "Blogeintrag", "100-130 Wörter mit Einleitung, Meinung, Beispielen und Schlussfrage."],
              ].map(([time, title, text]) => (
                <article key={title}>
                  <span>{time}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="quick-reference">
              <h3><ListChecks size={18} /> Satzstarter</h3>
              <p>Hola a todos · Hoy quiero hablar de · En mi opinión · Pienso que · Por ejemplo · Además · Por eso · En resumen · ¿Y vosotros? ¿Qué pensáis?</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <Sparkles size={18} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default App;

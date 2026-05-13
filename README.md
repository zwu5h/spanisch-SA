# Spanisch Schularbeit Trainer

Responsive Lernwebsite fuer den Stoff aus der Notion-Seite: Grammatik, Vokabeltrainer, interaktive Uebungen, Schreibtraining und Pruefungsmodus.

## Lokal starten

```bash
npm install
npm run dev
```

Die Seite laeuft dann lokal auf `http://localhost:5173`.

## Groq-Korrektur

Die Schreibuebungen nutzen den Serverless-Endpunkt `api/correct-writing.js` mit Groq `llama-3.3-70b-versatile`.
Setze dafuer die Environment Variable `GROQ_API_KEY`, lokal z. B. in Vercel CLI oder in den Vercel Project Settings.

## Vercel

Das Projekt ist ein Vite-React-Projekt. In Vercel reicht normalerweise:

- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Diese Werte sind auch in `vercel.json` hinterlegt.


https://spanisch-sa.vercel.app/

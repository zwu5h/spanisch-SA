const MODEL = "llama-3.3-70b-versatile";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Nur POST-Anfragen sind erlaubt." });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error: "GROQ_API_KEY fehlt. Lege den Key lokal oder in Vercel als Environment Variable an.",
    });
  }

  const { title = "", task = "", text = "" } = request.body || {};
  const cleanText = String(text).trim();

  if (cleanText.length < 20) {
    return response.status(400).json({ error: "Der Text ist zu kurz für eine sinnvolle Korrektur." });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.25,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "Du bist eine freundliche Spanisch-Lehrkraft für deutschsprachige Schüler. Korrigiere spanische Schreibübungen knapp, konkret und hilfreich. Antworte auf Deutsch, aber zeige spanische Korrekturen im Original. Gib keine erfundenen Regeln an.",
          },
          {
            role: "user",
            content: [
              `Aufgabe: ${title}`,
              `Vorgabe: ${task}`,
              "",
              "Text des Schülers:",
              cleanText,
              "",
              "Bitte antworte in diesem Format:",
              "1. Kurzes Gesamtfeedback",
              "2. Wichtigste Fehler mit Erklärung",
              "3. Verbesserte Version",
              "4. Ein Tipp für die nächste Schreibübung",
            ].join("\n"),
          },
        ],
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return response.status(groqResponse.status).json({
        error: data.error?.message || "Groq konnte die Korrektur nicht erstellen.",
      });
    }

    return response.status(200).json({
      feedback: data.choices?.[0]?.message?.content?.trim() || "Keine Korrektur erhalten.",
      model: MODEL,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Unerwarteter Fehler bei der Korrektur." });
  }
}

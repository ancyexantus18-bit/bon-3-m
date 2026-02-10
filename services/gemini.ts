
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalBoost = async (streak: number, missions: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un coach de discipline extrême pour un entrepreneur ou un créatif.
      L'utilisateur a une série de ${streak} jours consécutifs de succès.
      Ses missions pour aujourd'hui sont : ${missions.join(', ')}.
      Donne-lui un boost de motivation ultra-court (maximum 2 phrases), percutant, en français.
      Sois direct, sérieux et inspirant.`,
    });
    return response.text || "La discipline est le pont entre les buts et l'accomplissement.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ne t'arrête pas quand tu es fatigué, arrête-toi quand tu as fini.";
  }
};

export const analyzeProgress = async (stats: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyse ces statistiques de productivité : ${JSON.stringify(stats)}.
      Fais un diagnostic court de la discipline de cette personne en français. 
      Donne un conseil pour passer au niveau supérieur.`,
    });
    return response.text || "Continue sur ta lancée. La régularité est la clé.";
  } catch (error) {
    return "Analyse indisponible pour le moment.";
  }
};

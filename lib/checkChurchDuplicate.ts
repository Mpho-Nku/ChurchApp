import { supabase } from "@/lib/supabaseClient";
import { normalize, diceCoefficient } from "@/lib/stringSimilarity";

export async function checkChurchDuplicate(form: any) {
  const { data: churches } = await supabase.from("churches").select("*");

  if (!churches) return null;

  const name = normalize(form.name);
  const pastor = normalize(form.pastor);
  const street = normalize(form.street);
  const suburb = normalize(form.suburb);
  const township = normalize(form.township);

  const similarityThreshold = 0.6; // 60% similarity = possible duplicate

  let bestMatch: any = null;
  let bestScore = 0;

  churches.forEach((c) => {
    const scoreName = diceCoefficient(name, normalize(c.name));
    const scorePastor = diceCoefficient(pastor, normalize(c.pastor_name));
    const scoreStreet = diceCoefficient(street, normalize(c.street));
    const scoreLocation =
      diceCoefficient(suburb, normalize(c.suburb)) * 0.6 +
      diceCoefficient(township, normalize(c.township)) * 0.4;

    // Weighted scoring
    const finalScore =
      scoreName * 0.5 + scorePastor * 0.3 + scoreStreet * 0.1 + scoreLocation * 0.1;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMatch = c;
    }
  });

  // If similarity > threshold → duplicate
  return bestScore >= similarityThreshold ? bestMatch : null;
}

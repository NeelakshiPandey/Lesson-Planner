const API_KEY: string = "AIzaSyDxU9UXUObge17pInIqC6fW2Y05MIQVWFY";


interface LessonData {
  topic: string;
  gradeLevel: string;
  mainConcept: string;
  subtopics: string;
  materials: string;
  objectives: string;
  outline: string;
  assessment: string;
}


interface GeminiAPIResponse {
  candidates?: { content?: { parts?: { text: string }[] } }[];
}


export async function generateLessonPlan(userInput: LessonData): Promise<string> {
  const prompt: string = `
    Create a structured lesson plan based on these details:
    - Topic: ${userInput.topic}
    - Grade Level: ${userInput.gradeLevel}
    - Main Concept: ${userInput.mainConcept}
    - Subtopics: ${userInput.subtopics}
    - Materials Needed: ${userInput.materials}
    - Learning Objectives: ${userInput.objectives}
    - Lesson Outline: ${userInput.outline}
    - Assessment: ${userInput.assessment}
    
    Format the output as structured text.
  `;

  try {
    const response: Response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data: GeminiAPIResponse = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI.";
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error generating lesson plan.";
  }
}

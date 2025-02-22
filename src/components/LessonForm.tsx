import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


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


interface LessonFormProps {
  onGenerate: (data: LessonData) => void;
}

export default function LessonForm({ onGenerate }: LessonFormProps) {
  const [lessonData, setLessonData] = useState<LessonData>({
    topic: "",
    gradeLevel: "",
    mainConcept: "",
    subtopics: "",
    materials: "",
    objectives: "",
    outline: "",
    assessment: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLessonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onGenerate(lessonData); 
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create Lesson Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="topic"
          placeholder="Lesson Topic"
          value={lessonData.topic}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="gradeLevel"
          placeholder="Grade Level"
          value={lessonData.gradeLevel}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="mainConcept"
          placeholder="Main Concept"
          value={lessonData.mainConcept}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="subtopics"
          placeholder="Subtopics"
          value={lessonData.subtopics}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="materials"
          placeholder="Materials Needed"
          value={lessonData.materials}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="objectives"
          placeholder="Learning Objectives"
          value={lessonData.objectives}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="outline"
          placeholder="Lesson Outline"
          value={lessonData.outline}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="assessment"
          placeholder="Assessment Methods"
          value={lessonData.assessment}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Generate AI Lesson Plan</Button>
      </form>
    </Card>
  );
}

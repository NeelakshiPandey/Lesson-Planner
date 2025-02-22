import { useState, useEffect } from "react";
import LessonForm from "../components/LessonForm";
import { generateLessonPlan } from "../utils/geminiAPI";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Switch } from "@/components/ui/switch";

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

export default function LessonPlanner() {
  const [lessonPlan, setLessonPlan] = useState<string>(localStorage.getItem("lessonPlan") || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editablePlan, setEditablePlan] = useState<string>(lessonPlan);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("lessonPlan", editablePlan);
  }, [editablePlan]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleGenerate = async (userInput: LessonData): Promise<void> => {
    setLoading(true);
    setError("");

    const response: string = await generateLessonPlan(userInput);

    if (response.startsWith("Error")) {
      setError(response);
    } else {
      setLessonPlan(response);
      setEditablePlan(response);
      localStorage.setItem("lessonPlan", response);
    }

    setLoading(false);
  };

  const parseLessonPlan = (plan: string): LessonData => {
    try {
      const data: Partial<LessonData> = {};
      
      // Extract topic
      const topicMatch = plan.match(/Topic:\s*([^\n]+)/);
      data.topic = topicMatch ? topicMatch[1].trim() : "";

      // Extract grade level
      const gradeLevelMatch = plan.match(/Grade Level:\s*([^\n]+)/);
      data.gradeLevel = gradeLevelMatch ? gradeLevelMatch[1].trim() : "";

      // Extract main concept
      const mainConceptMatch = plan.match(/Main Concept:\s*([^\n]+)/);
      data.mainConcept = mainConceptMatch ? mainConceptMatch[1].trim() : "";

      // Extract subtopics
      const subtopicsMatch = plan.match(/Subtopics:\s*([^\n]+)/);
      data.subtopics = subtopicsMatch ? subtopicsMatch[1].trim() : "";

      // Extract materials
      const materialsSection = plan.match(/Materials Needed:([^]*?)(?=\n\s*\n|Learning Objectives:|$)/s);
      data.materials = materialsSection 
        ? materialsSection[1]
          .split('*')
          .map(item => item.trim())
          .filter(item => item)
          .join('\n')
        : "";

      // Extract objectives
      const objectivesSection = plan.match(/Learning Objectives:([^]*?)(?=\n\s*\n|Lesson Outline:|$)/s);
      data.objectives = objectivesSection
        ? objectivesSection[1]
          .split('*')
          .map(item => item.trim())
          .filter(item => item)
          .join('\n')
        : "";

      // Extract outline
      const outlineSection = plan.match(/Lesson Outline:([^]*?)(?=\n\s*\n|Assessment:|$)/s);
      if (outlineSection) {
        const outlineText = outlineSection[1];
        
        const sections = outlineText.match(/\d+\.\s+\*\*([^)]+)\)\*\*:\s*([^]*?)(?=\n\d+\.|$)/g) || [];
        data.outline = sections
          .map(section => {
            const [, title, content] = section.match(/\d+\.\s+\*\*([^)]+)\)\*\*:\s*(.+)/) || [];
            if (title && content) {
              return `${title}: ${content.trim()}`;
            }
            return section.trim();
          })
          .join('\n');
      } else {
        data.outline = "";
      }

      // Extract assessment
      const assessmentSection = plan.match(/Assessment:([^]*?)$/s);
      data.assessment = assessmentSection
        ? assessmentSection[1]
          .split('*')
          .map(item => item.trim())
          .filter(item => item)
          .join('\n')
        : "";

      return data as LessonData;
    } catch (error) {
      console.error("Error parsing lesson plan:", error);
      return {
        topic: "",
        gradeLevel: "",
        mainConcept: "",
        subtopics: "",
        materials: "",
        objectives: "",
        outline: "",
        assessment: ""
      };
    }
  };

  const addPageIfNeeded = (doc: jsPDF, y: number, minSpace: number = 40): number => {
    if (y > doc.internal.pageSize.height - minSpace) {
      doc.addPage();
      return 20; 
    }
    return y;
  };

  const handleDownloadPDF = (): void => {
    const doc = new jsPDF();
    const parsedData = parseLessonPlan(editablePlan);
    
    const createSectionHeader = (text: string, y: number, color: [number, number, number]): number => {
      y = addPageIfNeeded(doc, y, 30);
      doc.setFillColor(...color);
      doc.rect(20, y, 170, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(text, 25, y + 9);
      return y + 20;
    };

   
    let y = 60;
    
   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text("LESSON PLAN", doc.internal.pageSize.width / 2, y, { align: "center" });
    
    y += 40;
    
    // Topic
    doc.setFontSize(24);
    const topicLines = doc.splitTextToSize(`Topic: ${parsedData.topic}`, 150);
    doc.text(topicLines, doc.internal.pageSize.width / 2, y, { align: "center" });
    
    y += topicLines.length * 12 + 20;
    
    // Subject & Grade Level
    doc.setFontSize(18);
    doc.text(`Subject: ${parsedData.mainConcept}`, doc.internal.pageSize.width / 2, y, { align: "center" });
    y += 15;
    doc.text(`Grade Level: ${parsedData.gradeLevel}`, doc.internal.pageSize.width / 2, y, { align: "center" });
    
    y += 40;
    
    // Date and Teacher Info
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width / 2, y, { align: "center" });
    
    // Add new page for content
    doc.addPage();
    y = 20;

    // Summary Section
    y = createSectionHeader("Summary", y, [82, 86, 255]);

    const summaryData = [
      ["Date", new Date().toLocaleDateString()],
      ["Subject", parsedData.mainConcept],
      ["Year Group or Grade Level", parsedData.gradeLevel],
      ["Main Topic or Unit", parsedData.topic],
      ["Subtopics or Key Concepts", parsedData.subtopics]
    ];

    autoTable(doc, {
      startY: y,
      head: [],
      body: summaryData,
      theme: 'plain',
      styles: {
        fontSize: 12,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { 
          fillColor: [230, 230, 255],
          fontStyle: 'bold',
          cellWidth: 80 
        },
        1: { cellWidth: 90 }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 15;
    y = addPageIfNeeded(doc, y);

    // Materials Section
    y = createSectionHeader("Materials Needed", y, [52, 58, 64]);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const materials = parsedData.materials.split('\n').filter(item => item.trim());
    materials.forEach(material => {
      y = addPageIfNeeded(doc, y);
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(25, y - 4, 4, 4);
      
      const splitMaterial = doc.splitTextToSize(material.trim(), 150);
      doc.text(splitMaterial, 35, y);
      y += splitMaterial.length * 7 + 5;
    });

    y += 10;
    y = addPageIfNeeded(doc, y);

    // Learning Objectives Section
    y = createSectionHeader("Learning Objectives", y, [82, 86, 255]);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const objectives = parsedData.objectives.split('\n').filter(item => item.trim());
    objectives.forEach((objective, index) => {
      y = addPageIfNeeded(doc, y);
      const splitObjective = doc.splitTextToSize(`${index + 1}. ${objective}`, 160);
      doc.text(splitObjective, 25, y);
      y += splitObjective.length * 7 + 5;
    });

    y += 10;
    y = addPageIfNeeded(doc, y);

    // Lesson Outline Section
    y = createSectionHeader("Lesson Outline", y, [52, 58, 64]);

    const outlineItems = parsedData.outline.split('\n')
      .filter(item => item.trim())
      .map(item => {
        const [title = "", ...contentParts] = item.split(':').map(s => s.trim());
        const content = contentParts.join(':').trim();
        const duration = title.match(/\(([^)]+)\)/) || ["", ""];
        return [
          duration[1] || "xx minutes",
          content || title,
          ""
        ];
      });

    autoTable(doc, {
      startY: y,
      head: [["Duration", "Guide", "Remarks"]],
      body: outlineItems,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [230, 230, 255],
        textColor: 0,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 80 },
        2: { cellWidth: 60 }
      },
      didDrawPage: (data) => {
        // Add header to new pages
        if (data.pageCount > 1) {
          doc.setFillColor(52, 58, 64);
          doc.rect(20, 20, 170, 12, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.text("Lesson Outline (continued)", 25, 29);
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 15;
    y = addPageIfNeeded(doc, y);

    // Assessment Section
    y = createSectionHeader("Assessment", y, [82, 86, 255]);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const assessmentItems = parsedData.assessment.split('\n').filter(item => item.trim());
    assessmentItems.forEach((item, index) => {
      y = addPageIfNeeded(doc, y);
      const splitItem = doc.splitTextToSize(`${index + 1}. ${item}`, 160);
      doc.text(splitItem, 25, y);
      y += splitItem.length * 7 + 5;
    });

    y += 10;
    y = addPageIfNeeded(doc, y);

    // Notes Section
    y = createSectionHeader("Notes", y, [82, 86, 255]);

    // Add lines for notes
    doc.setDrawColor(200, 200, 200);
    for (let i = 0; i < 8; i++) {
      y = addPageIfNeeded(doc, y);
      doc.line(25, y, 185, y);
      y += 15;
    }

    doc.save("Lesson_Plan.pdf");
  };

  const clearLessonPlan = (): void => {
    setLessonPlan("");
    setEditablePlan("");
    localStorage.removeItem("lessonPlan");
  };

  return (
    <div className={`p-6 min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Lesson Planner</h1>
        <div className="flex items-center gap-2">
          <span>Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>

      <LessonForm onGenerate={handleGenerate} />

      {loading && <p className="text-center mt-4">⏳ Generating Lesson Plan...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {lessonPlan && (
        <Card className={`mt-6 p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
          <h2 className="text-xl font-semibold">Generated Lesson Plan</h2>
          <textarea
            className={`w-full p-3 border rounded-md mt-4 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            value={editablePlan}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditablePlan(e.target.value)}
            rows={10}
          />
          <div className="flex gap-4 mt-4">
            <Button onClick={handleDownloadPDF} className="w-full">
              Download as PDF
            </Button>
            <Button onClick={clearLessonPlan} className="w-full bg-red-500 hover:bg-red-600">
              Clear Lesson
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

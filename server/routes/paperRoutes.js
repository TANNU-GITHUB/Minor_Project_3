import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Paper from '../models/Paper.js';
import { pdf } from 'pdf-to-img'; 
import sharp from 'sharp';
import { execSync } from 'child_process';

const router = express.Router();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "Gemini API Key missing." });

    // ==========================================
    // PHASE 1: GEMINI (Text Analysis via PDF)
    // ==========================================
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Pdf = fileBuffer.toString("base64");

    // Using the exact prompt from pr2.js (minus the figures array, which is handled in Phase 2)
    const geminiPrompt = `
      Analyze the attached PDF academic paper. Provide a response in valid JSON format exactly like this:
      {
          "summary": ["Bullet point 1", "Bullet point 2"],
          "summaryHinglish": ["Hinglish bullet 1", "Hinglish bullet 2"],
          "mindMap": {
                  "name": "Full Title of the Article in concise manner",
                  "children": [
                    {
                      "name": "Abstract & Core Contribution",
                      "children": [
                        {"name": "Main Problem Solved"},
                        {"name": "Key Insight"}
                      ]
                    },
                    {
                      "name": "Methodology: How it Works",
                      "children": [
                        {"name": "Main technique used"},
                        {"name": "Data set used"},
                        {"name": "Novel component"}
                      ]
                    },
                    {
                      "name": "Results & Findings",
                      "children": [
                        {"name": "Key quantitative metric"},
                        {"name": "Comparison conclusion"}
                      ]
                    },
                    {
                      "name": "Discussion & Future Scope",
                      "children": [
                        {"name": "Limitation mentioned"},
                        {"name": "Future research direction"}
                      ]
                    }
                  ]
                },
          "flowchart": [{ "step": "1", "process": "Step 1" }],
          "notes": [
            "Generate PAGE 1 (First array item). FOCUS: Core Summary. STRICT RULES: NO paragraphs. Use concise <note_bullet>Short fact here</note_bullet> for all subtopic details. EMOJIS ARE STRICTLY FORBIDDEN except inside headings like <note_h1>Main Title 📄</note_h1> or <note_h2>Subheading 🔍</note_h2>. Highlight important terms using <pink>term</pink> or <blue>term</blue>. End the page with a <note_box>Crucial takeaway note</note_box>.",
            "Generate PAGE 2 (Second array item). FOCUS: Key Findings and Tradeoffs. Start with <note_h2>Key Findings 💡</note_h2> followed by concise <note_bullet> points. Then, you MUST divide the bottom of the page into 2 sections for pros and cons using this exact layout: <pros_cons><pro>Short bulleted advantage</pro><con>Short bulleted disadvantage</con></pros_cons>. NO EMOJIS except in the heading.",
            "Generate PAGE 3 (Third array item). FOCUS: Process and Timeline. If the paper has history or literature review, build a timeline with 1-line summaries: <timeline><item>Year/Phase: 1-line summary</item></timeline>. You MUST also include a flowchart with arrows to explain the methodology: <flowchart>Step 1 ➔ Step 2 ➔ Step 3</flowchart>. Add a <note_box>Methodology note</note_box>.",
            "Generate PAGE 4 (Fourth array item). FOCUS: Breaking down complexity. Use <note_h2>Complex Concept Explained 🧠</note_h2>. You MUST explain the hardest topic from the paper using an analogy or real-world example wrapped in <analogy>Think of it like...</analogy>. Follow up with concise <note_bullet> points. Highlight terms with <pink>.",
            "Generate PAGE 5+ (Fifth array item). FOCUS: Conclusion. Provide final findings using <note_bullet>. Include a final <note_box>Future scope or final thought</note_box>. FINAL SYSTEM CHECK: Did you generate at least 5 pages? Are there ZERO paragraphs? Are emojis ONLY in headings? Are you using <pink> and <blue> highlighters? If yes, complete generation."
          ],
          "flashcards": [{"question": "Q1?", "answer": "A1"}],
          "glossary": [{"term": "Word", "definition": "Meaning", "definitionHinglish": "Hinglish meaning"}],
          "quiz": [{"question": "Q1", "options": ["A", "B", "C", "D"], "answer": "A"}],
          "highlights": [
            "Provide highly impactful, complete, substantial sentences found verbatim (word-for-word) in the text.",
            "These sentences MUST represent the core thesis, main arguments, major findings, unique methodology steps, or essential contributions of the paper.",
            "STRICTLY AVOID headings, figure references, table data, transitional phrases, or single common words."
          ],
          "difficulty": "Medium"
      }
      
      STRICT INSTRUCTIONS:
      1. LANGUAGE TRANSLATION: You MUST include Hinglish translations. For the summary, provide an English version in 'summary' and a Hinglish version in 'summaryHinglish'. 
      2. GLOSSARY TRANSLATION: For the glossary array, each object must have 'term', 'definition' (English), and 'definitionHinglish' (Hinglish).
      3. PHYSICAL PAGE LIMITS: Notes must be strictly concise bullet points. No bullet point may exceed 15 words. Do not write paragraphs. Keep the entire response under 100 words per section to ensure it fits on a physical page.
      4. MIND MAP HIERARCHY: You MUST organize the article logical, deeply nested JSON tree that follows the paper's structure (Abstract -> Intro -> Methods -> Results -> Discussion). Start with the paper title, then major sections as children, and subsections/key points as sub-children. It must have 'name' and 'children' keys throughout. Make it deeply nested for clarity also the headings should be in concise manner easy to understand. CRITICAL: Nodes must be extremely concise Keywords only (Maximum 1 to 3 words). NEVER use sentences or lines.
      5. NO FIGURES IN THIS PHASE: Do NOT include a figures array here. Focus entirely on the text content.
      6.There must be atleast 5 elements in these : summary, quiz, flashcard, glossary.~
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    console.log("Starting Phase 1: Text Extraction...");
    const geminiRes = await fetch(geminiUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }, { inlineData: { data: base64Pdf, mimeType: "application/pdf" } }] }],
            generationConfig: { responseMimeType: "application/json" }
        }) 
    });
    
    const geminiDataRaw = await geminiRes.json();
    if (geminiDataRaw.error) throw new Error(geminiDataRaw.error.message);
    const aiData = JSON.parse(geminiDataRaw.candidates[0].content.parts[0].text);

    // ==========================================
    // PHASE 2: GEMINI VISION (Figures Analysis)
    // ==========================================
//     console.log("Starting Phase 2: Converting PDF to Images for Vision Analysis...");
//     const pdfDoc = await pdf(req.file.path, { scale: 2 });
//     const pdfArray = [];
//     for await (const page of pdfDoc) {
//       pdfArray.push(page);
//     }
    
//     const imageParts = pdfArray.map((pageBuffer) => ({
//       inlineData: { data: Buffer.from(pageBuffer).toString("base64"), mimeType: "image/png" }
//     }));

//     const visionPrompt = `
//       Analyze the attached images of an academic paper. Extract major visual element like table/figure/diagram only. Provide a response in valid JSON exactly like this:
//       {
//           "figures": [
//             {
//               "figure_title": "Name of the figure in concise form",
//               "inference": "A bulleted summary (<100 words) of what this figure denotes.",
//               "page_index": 0,
//               "figure_bounding_box": [10.5, 20.0, 60.0, 45.0], 
//               "annotations": [
//                 {
//                   "label": "Short Title",
//                   "explanation": "Brief explanation of this specific part.",
//                   "coords": [25.0, 30.0] 
//                 }
//               ]
//             }
//           ]
//       }
//       STRICT RULES:
//       1. WHAT TO EXTRACT: ONLY extract actual Charts, Graphs, Diagrams, Schematics, and Data Tables. IGNORE pure text paragraphs.
//       2. BOUNDING BOX (CRITICAL): "figure_bounding_box" [X, Y, WIDTH, HEIGHT] MUST be strict percentages (0.0 to 100.0) of the page boundaries. You MUST include the entire diagram, all axis labels, legends, and the figure caption. Add a 2% margin to your width and height to ensure nothing is cut off!
//       3. "coords" [X, Y] MUST be the exact percentage (0.0 to 100.0) point on the FULL page where this specific part is located.
//       4. NO EMOJIS: You are strictly forbidden from using emojis anywhere in this JSON.
//     `;

//     console.log("Starting Phase 2: Extracting Bounding Boxes...");
//     const visionRes = await fetch(geminiUrl, { 
//         method: 'POST', 
//         headers: { 'Content-Type': 'application/json' }, 
//         body: JSON.stringify({
//             contents: [{ parts: [{ text: visionPrompt }, ...imageParts] }],
//             generationConfig: { responseMimeType: "application/json", temperature: 0.1 } 
//         }) 
//     });

//     const visionDataRaw = await visionRes.json();
//     if (visionDataRaw.error) throw new Error(visionDataRaw.error.message);
//     const visionData = JSON.parse(visionDataRaw.candidates[0].content.parts[0].text);

//     // Attach the base64 image of the specific page to the figure so the frontend can crop it
//     const processedFigures = (visionData.figures || []).map(fig => {
//       const safeIdx = Math.min(fig.page_index || 0, pdfArray.length - 1); 
//       const base64Image = Buffer.from(pdfArray[safeIdx]).toString('base64');
//       return { ...fig, imageBase64: `data:image/png;base64,${base64Image}` };
//     });

//     // ==========================================
//     // PHASE 3: Merge and Save
//     // ==========================================
//     console.log("Saving to Database...");
//     const newPaper = new Paper({
//       title: req.file.originalname,
//       originalText: "Processed via 100% Free Gemini Hybrid Architecture.", 
//       fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
//       summary: Array.isArray(aiData.summary) ? aiData.summary.join('\n\n') : aiData.summary,
//       summaryHinglish: Array.isArray(aiData.summaryHinglish) ? aiData.summaryHinglish.join('\n\n') : aiData.summaryHinglish,
//       mindMapData: aiData.mindMap,
//       flowchartData: aiData.flowchart,
//       notesData: aiData.notes,
//       flashcardsData: aiData.flashcards,
//       glossaryData: aiData.glossary,
//       quizData: aiData.quiz,
//       highlightsData: aiData.highlights,
//       figuresData: processedFigures, 
//       difficulty: aiData.difficulty || "Medium"
//     });

//     const savedPaper = await newPaper.save();
//     res.status(201).json({ message: "Processed successfully", paper: savedPaper });

//   } catch (error) {
//     console.error("Route Error:", error);
//     res.status(500).json({ error: "Failed to process the paper" });
//   }
// });


// ==========================================
    // PHASE 2: PyMuPDF Extraction & Gemini Two-Pass
    // ==========================================
    console.log("Starting Phase 2: PyMuPDF Figure Extraction...");
    
    // 1. Run Python Microservice
    const pythonOutput = execSync(`python figure_extractor.py "${req.file.path}"`, { maxBuffer: 50 * 1024 * 1024 }).toString();
    
    // CRASH PREVENTION: Extract ONLY the JSON array and ignore any Python terminal warnings
    const jsonStart = pythonOutput.indexOf('[');
    const jsonEnd = pythonOutput.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
       throw new Error("Failed to find valid JSON array from Python script output.");
    }
    
    const cleanJsonString = pythonOutput.substring(jsonStart, jsonEnd + 1);
    const allExtractedFigures = JSON.parse(cleanJsonString);
    
    // USER REQUEST: Limit to processing a maximum of 5 images to save time/API quota
    const extractedFigures = allExtractedFigures.slice(0, 2);
    
    const processedFigures = [];

    // 2. Iterate and run the Two-Pass Gemini strategy
    for (const [index, fig] of extractedFigures.entries()) {
      console.log(`Processing Figure ${index + 1}/${extractedFigures.length}...`);
      
      try {
        const imageInlineData = {
          inlineData: { 
              data: fig.imageBase64.split(',')[1], 
              mimeType: "image/png" 
          }
        };

        // --- PASS A: Identify Components ---
        const passAPrompt = `
          Analyze this cropped figure/table.
          1. Provide a concise "figure_title".
          2. Provide a short "inference" (bulleted summary < 100 words).
          3. Identify maximum 3 distinct, important visual components (e.g., a specific trend line, axis, or data cell).
          Return valid JSON:
          {
            "figure_title": "Title",
            "inference": "...",
            "components": [ { "label": "Name of component", "explanation": "Why it matters" } ]
          }
        `;

        const passARes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: passAPrompt }, imageInlineData] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        
        const passARaw = await passARes.json();
        if (passARaw.error) throw new Error(passARaw.error.message);
        const passAData = JSON.parse(passARaw.candidates[0].content.parts[0].text);

        // --- PASS B: Locate Components ---
        const passBPrompt = `
          Here are components identified in this image:
          ${JSON.stringify(passAData.components || [])}
          
          Where exactly is each component located? Give me the exact X, Y coordinates as a percentage (0.0 to 100.0) of the image width and height.
          Return valid JSON:
          {
            "annotations": [ { "label": "Name", "explanation": "...", "coords": [X, Y] } ]
          }
        `;

        const passBRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: passBPrompt }, imageInlineData] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
          })
        });

        const passBRaw = await passBRes.json();
        if (passBRaw.error) throw new Error(passBRaw.error.message);
        const passBData = JSON.parse(passBRaw.candidates[0].content.parts[0].text);

        // --- STEP 9: Validate Coordinates (CRASH FIX) ---
        let rawAnnotations = passBData.annotations || [];
        
        // Strictly verify that coords is an array before doing math on it
        let validAnnotations = rawAnnotations.filter(a => {
          if (!a || !Array.isArray(a.coords) || a.coords.length < 2) return false;
          const [x, y] = a.coords;
          return x >= 5 && x <= 95 && y >= 5 && y <= 95;
        });

        // Deduplicate overlapping coords (within 10%)
        let dedupedAnns = [];
        for (const ann of validAnnotations) {
          const isDup = dedupedAnns.some(d => 
            Math.abs(d.coords[0] - ann.coords[0]) < 10 && 
            Math.abs(d.coords[1] - ann.coords[1]) < 10
          );
          if (!isDup) dedupedAnns.push(ann);
        }

        // If fewer than 2 valid remain, wipe annotations completely
        if (dedupedAnns.length < 2) {
          dedupedAnns = [];
        }

        processedFigures.push({
          figure_title: passAData.figure_title || "Figure",
          inference: passAData.inference || "Analysis generated.",
          page_index: fig.page_index,
          imageBase64: fig.imageBase64,
          annotations: dedupedAnns
        });

      } catch (err) {
        console.error(`Error processing figure ${index + 1}, skipping AI analysis:`, err.message);
        
        // GRACEFUL FALLBACK: If Gemini hallucinates or crashes, still show the image to the user!
        processedFigures.push({
          figure_title: `Extracted Figure ${index + 1}`,
          inference: "AI analysis was skipped or failed for this specific figure.",
          page_index: fig.page_index,
          imageBase64: fig.imageBase64,
          annotations: []
        });
      }
    }

    
    // ==========================================
    // PHASE 3: Merge and Save
    // ==========================================
    console.log("Saving to Database...");
    const newPaper = new Paper({
      title: req.file.originalname,
      originalText: "Processed via 100% Free Gemini Hybrid Architecture.", 
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      summary: Array.isArray(aiData.summary) ? aiData.summary.join('\n\n') : aiData.summary,
      summaryHinglish: Array.isArray(aiData.summaryHinglish) ? aiData.summaryHinglish.join('\n\n') : aiData.summaryHinglish,
      mindMapData: aiData.mindMap,
      flowchartData: aiData.flowchart,
      notesData: aiData.notes,
      flashcardsData: aiData.flashcards,
      glossaryData: aiData.glossary,
      quizData: aiData.quiz,
      highlightsData: aiData.highlights,
      figuresData: processedFigures, // Pass the Sharp cropped figures!
      difficulty: aiData.difficulty || "Medium"
    });

    const savedPaper = await newPaper.save();
    res.status(201).json({ message: "Processed successfully", paper: savedPaper });

  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ error: "Failed to process the paper" });
  }
});

router.post('/:id/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "API Key missing." });

    const promptText = `
      You are an expert AI academic tutor. You are helping a student understand a research paper titled "${paper.title}".
      Here is the AI-generated summary of the paper to give you context: "${paper.summary}"
      The student has asked: "${message}"
      Provide a helpful, accurate, and concise answer. Structure your answer nicely.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.7 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const aiReply = data.candidates[0].content.parts[0].text;
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
});

router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch papers" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch paper" });
  }
});

export default router;
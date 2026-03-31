# 📚 Lumina: Smart Academic PDF Analyzer

Transform dense, static academic research papers into dynamic, interactive study environments. Built with a powerful hybrid architecture using Node.js, Python, and the Gemini API, Lumina automates the heavy lifting of reading complex research.

Inspired by Google's NotebookLM, Lumina pushes the boundaries for visual learners by mathematically cropping charts and building animated knowledge trees.

## ✨ Key Features

* **🧠 Animated Knowledge Maps:** Automatically generates deeply nested, interactive D3.js tree maps that visualize the paper's hierarchy. Features a sequential "Auto-Play" growth animation.
* **📊 Smart Figure Explainer:** Uses a Python microservice (PyMuPDF) to perfectly crop charts and diagrams, then uses Gemini Vision to overlay staggered, textbook-style annotations and arrows—without any overlapping text.
* **📝 Interactive Study Engine:** Automatically generates 3D flip flashcards, knowledge-check quizzes, and a searchable glossary.
* **🌐 Bilingual Summaries:** Extracts core concepts and provides instant summaries in both English and Hinglish.
* **💬 Context-Aware AI Chat:** Ask questions and get instant answers based specifically on the context of the uploaded paper.
* **🖨️ Exportable Smart Notes:** Generates multi-page, structured bullet-point notes that can be downloaded as a high-quality PDF.

## 🏗️ System Architecture

Lumina uses a highly optimized, deterministic extraction pipeline rather than relying purely on LLM guesswork:

1. **Text Phase (Node.js + Gemini 2.5 Flash):** The raw PDF is parsed to extract core concepts, summaries, notes, and the hierarchical JSON for the mind map.
2. **Vision Phase (Python + PyMuPDF + Sharp):** A Python microservice detects vector graphics and raster images, filters out noise (like headers/logos), and crops exact bounding boxes.
3. **Annotation Phase (Gemini Vision):** The cropped images are sent to Gemini Vision in a "Two-Pass" approach to identify key visual components and map their exact X/Y coordinates.
4. **Frontend Render (React):** The React client uses standard HTML and SVG lines to perfectly render floating explanation boxes that point dynamically to the image features.

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS, Lucide Icons, React-D3-Tree
* **Backend:** Node.js, Express.js, MongoDB
* **Microservice:** Python, PyMuPDF (Fitz)
* **AI / APIs:** Google Gemini 2.5 Flash & Vision Models
* **Image Processing:** Sharp, PDF-to-IMG

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and Python installed on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd lumina

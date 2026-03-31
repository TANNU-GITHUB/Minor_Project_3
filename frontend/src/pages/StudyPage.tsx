import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { Shapes3D } from '../components/Shapes3D';
import { TabPanel } from '../components/TabPanel';
import { ChatSidebar } from '../components/ChatSidebar';

// --- NEW: Import React-PDF ---
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- THE BULLETPROOF VITE FIX ---
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const displayName = 'Tannu';

function difficultyBadgeClass(difficulty: string) {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy') return 'badge badge-easy';
  if (d === 'medium') return 'badge badge-medium';
  return 'badge badge-hard';
}

export function StudyPage() {
  const { paperId } = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- NEW: PDF Pagination State ---
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/papers/${paperId}`);
        setPaper(response.data);
      } catch (error) {
        console.error("Failed to fetch paper:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (paperId) fetchPaperData();
  }, [paperId]);

  // --- NEW: Highlighter Function ---
  // This checks the text layer of the PDF. If the text matches an AI highlight, it paints it yellow.
  const textRenderer = (textItem: any) => {
    const highlights = paper?.highlightsData || [];
    let isHighlighted = false;

    // Check if the current chunk of PDF text is part of our important AI sentences
    highlights.forEach((highlight: string) => {
      if (highlight && highlight.includes(textItem.str) && textItem.str.length > 5) {
        isHighlighted = true;
      }
    });

    if (isHighlighted) {
      return `<mark style="background-color: #fde047; color: black; padding: 2px; border-radius: 3px;">${textItem.str}</mark>`;
    }
    return textItem.str;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <div className="glass-card flex flex-col items-center gap-4 py-12 px-10 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          <p className="text-text-dark font-medium">Loading AI Analysis...</p>
        </div>
      </div>
    );
  }

  if (!paper) return <div className="min-h-screen flex items-center justify-center">Paper not found.</div>;

  return (
    <div className="min-h-screen flex overflow-hidden">
      <FloatingOrbs />
      <Shapes3D />
      <Sidebar userName={displayName} />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <header className="h-20 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="min-w-0 pr-4">
            <h1 className="text-xl font-bold font-display text-text-dark truncate">{paper.title}</h1>
            <p className="text-sm text-text-muted mt-0.5 flex flex-wrap items-center gap-2">
              <span>AI Difficulty Rating:</span>
              <span className={difficultyBadgeClass(paper.difficulty)}>{paper.difficulty}</span>
            </p>
          </div>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="btn-primary !py-3 !px-5 text-sm inline-flex items-center gap-2 shrink-0">
            <MessageCircle className="w-4 h-4" /> AI Chat
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 lg:p-8 overflow-hidden min-h-0">
            
            {/* --- UPDATED: Real PDF Viewer Container --- */}
            <div className="flex-1 flex flex-col min-h-0 glass overflow-hidden">
              <div className="flex-1 overflow-auto flex justify-center p-6 min-h-0 custom-scrollbar">
                
                {/* React-PDF Document Component */}
                {paper.fileUrl ? (
                  <Document
                  file={paper.fileUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={(error) => console.error("🚨 PDF CRASH REPORT:", error.message)} // <-- ADD THIS LINE
                  loading={<Loader2 className="w-8 h-8 animate-spin text-primary-500 mt-20" />}
                  className="flex flex-col items-center shadow-glass-lg rounded-xl overflow-hidden"
                >
                    <Page 
                      pageNumber={currentPage} 
                      width={500} // Set a fixed width that fits your design
                      renderTextLayer={true}
                      renderAnnotationLayer={false}
                      customTextRenderer={textRenderer} // Injects the yellow highlighter
                      className="bg-white"
                    />
                  </Document>
                ) : (
                  <div className="text-center text-text-muted mt-20">
                    <p>PDF file not found.</p>
                    <p className="text-sm mt-2">Please upload a new paper to view it here.</p>
                  </div>
                )}
              </div>

              {/* Dynamic Pagination Controls */}
              <div className="p-4 border-t border-white/25 flex items-center justify-between bg-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-2.5 rounded-xl text-text-dark hover:bg-white/35 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-text-muted font-medium">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                  className="p-2.5 rounded-xl text-text-dark hover:bg-white/35 transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[450px] min-h-[320px] lg:min-h-0 flex flex-col glass overflow-hidden shrink-0">
              <TabPanel paperData={paper} onChatOpen={() => setIsChatOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} paperId={paperId} />
      {isChatOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setIsChatOpen(false)} />}
    </div>
  );
}
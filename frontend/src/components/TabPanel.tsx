import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import html2pdf from 'html2pdf.js';
import { MessageSquare, ChevronLeft, ChevronRight, RotateCcw, Maximize2, Download, X, ZoomOut, Minimize2 } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { Document, Page } from 'react-pdf';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import Tree from 'react-d3-tree';

type TabName = 'summary' | 'mindmap' | 'flowchart' | 'highlights' | 'notes' | 'quiz' | 'flashcards' | 'glossary'| 'figures';

interface TabPanelProps {
  onChatOpen: () => void;
  paperData?: any; 
}

export function TabPanel({ onChatOpen, paperData }: TabPanelProps) {
  const [activeTab, setActiveTab] = useState<TabName>('summary');

  // --- NEW: Quiz State ---
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- NEW: Flashcard State ---
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // --- NEW: Notes State ---
  const [currentNotePage, setCurrentNotePage] = useState(0);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const [isZoomedIn, setIsZoomedIn] = useState(false); // Defaults to Zoomed Out (fit to page)
  // --- NEW: Language Toggle State ---
  const [summaryLang, setSummaryLang] = useState<'en' | 'hinglish'>('en');
  const [glossaryLang, setGlossaryLang] = useState<'en' | 'hinglish'>('en');

  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);
  const [isFiguresFullScreen, setIsFiguresFullScreen] = useState(false);

  const [isMindMapFullScreen, setIsMindMapFullScreen] = useState(false);

  // --- NEW: Mind Map Layering State ---
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const tabs: { name: TabName; label: string }[] = [
    { name: 'summary', label: 'Summary' },
    { name: 'mindmap', label: 'Mind Map' },
    { name: 'flowchart', label: 'Flowchart' },
    { name: 'notes', label: 'Notes' },
    { name: 'quiz', label: 'Quiz' },
    { name: 'figures', label: 'Figure Explainer' },
    { name: 'flashcards', label: 'Flashcards' },
    { name: 'glossary', label: 'Glossary' },
  ];

  // Safely converts strict AI tags to our realistic CSS classes
  // Safely converts strict AI tags to our realistic CSS classes
  const formatNoteText = (text: string) => {
    let formatted = text
      .replace(/<note_h1>(.*?)<\/note_h1>/g, '<span class="note-h1">$1</span>')
      .replace(/<note_h2>(.*?)<\/note_h2>/g, '<span class="note-h2">$1</span>')
      .replace(/<note_bullet>(.*?)<\/note_bullet>/g, '<span class="note-bullet">$1</span>')
      .replace(/<note_box>(.*?)<\/note_box>/g, '<span class="note-box">$1</span>')
      .replace(/<pros_cons>(.*?)<\/pros_cons>/g, '<div class="note-pros-cons">$1</div>')
      .replace(/<pro>(.*?)<\/pro>/g, '<div class="note-pro">$1</div>')
      .replace(/<con>(.*?)<\/con>/g, '<div class="note-con">$1</div>')
      .replace(/<timeline>(.*?)<\/timeline>/g, '<div class="note-timeline">$1</div>')
      .replace(/<item>(.*?)<\/item>/g, '<span class="note-timeline-item">$1</span>')
      .replace(/<flowchart>(.*?)<\/flowchart>/g, '<div class="note-flowchart">$1</div>')
      .replace(/<analogy>(.*?)<\/analogy>/g, '<span class="note-analogy">$1</span>')
      .replace(/<pink>(.*?)<\/pink>/g, '<span class="hl-pink">$1</span>')
      .replace(/<blue>(.*?)<\/blue>/g, '<span class="hl-blue">$1</span>')
      .replace(/<formula>(.*?)<\/formula>/g, '<span class="formula-box">$1</span>');
    return { __html: formatted };
  };

  // Generates and downloads a high-quality PDF of the notes
  const handleDownloadPDF = () => {
    const element = document.getElementById('hidden-print-container');
    if (!element) return;
    
    // Temporarily show the element for the PDF engine to capture it
    element.style.display = 'block';
    
    const opt = {
      margin:       10,
      filename:     `${paperData?.title || 'Lumina_Notes'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Hide it again after downloading
      element.style.display = 'none';
    });
  };

  const renderContent = () => {
    if (!paperData) {
      return <div className="text-text-muted text-sm p-2">Loading data...</div>;
    }

    switch (activeTab) {
      case 'summary': {
        // Dynamically choose which text to display based on the toggle state
        const summaryText = summaryLang === 'en' 
          ? paperData.summary 
          : (paperData.summaryHinglish || paperData.summary);

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-text-dark"> Summary</h3>
              
              {/* Language Toggle Switch */}
              <div className="flex bg-white/40 border border-white/55 rounded-lg p-1 shadow-glass-sm">
                <button
                  onClick={() => setSummaryLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${summaryLang === 'en' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setSummaryLang('hinglish')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${summaryLang === 'hinglish' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                >
                  Hinglish
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {summaryText ? (
                summaryText.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-sm text-text-dark leading-relaxed bg-white/40 border border-white/55 rounded-xl p-4 shadow-glass">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-sm text-text-muted">No summary available.</p>
              )}
            </div>
          </div>
        );
      }

      case 'mindmap': {
        const rawMindMapData = paperData.mindMapData;

        if (!rawMindMapData || typeof rawMindMapData !== 'object' || Array.isArray(rawMindMapData) || !rawMindMapData.name) {
          return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white/40 border border-white/55 rounded-xl">
              <p className="text-sm font-bold text-text-dark mb-2">Old Format Detected ⚠️</p>
              <p className="text-xs text-text-muted max-w-sm">
                This paper was processed with an older format. Please upload the PDF again to generate the new Animated Tree Map!
              </p>
            </div>
          );
        }

        const MindMapRenderer = ({ isFullscreen }: { isFullscreen: boolean }) => {
          const [mode, setMode] = useState<'manual' | 'auto'>('manual');
          const [visibleCount, setVisibleCount] = useState(0); 
          const [translate, setTranslate] = useState({ x: 0, y: 0 });

          const containerRef = useCallback((containerElem: HTMLDivElement | null) => {
            if (containerElem !== null) {
              const { width, height } = containerElem.getBoundingClientRect();
              setTranslate({ x: width / 5, y: height / 2 }); 
            }
          }, [isFullscreen]);

          // --- 1. THE SEQUENCE ENGINE (Node-by-Node DFS) ---
          // Tags every node with a sequence number so they grow sequentially down the branches
          const { sequencedData, totalNodes } = useMemo(() => {
            let seq = 0;
            const assignSequence = (node: any) => {
              const newNode = { ...node, _seq: seq++ };
              if (newNode.children) {
                newNode.children = newNode.children.map(assignSequence);
              }
              return newNode;
            };
            const data = assignSequence(rawMindMapData);
            return { sequencedData: data, totalNodes: seq };
          }, [rawMindMapData]);

          // --- 2. DYNAMIC AUTO-PLAY TIMER ---
          useEffect(() => {
            let interval: NodeJS.Timeout;
            if (mode === 'auto') {
              setVisibleCount(0); // Start with only the root node
              
              // Dynamic Speed: Big trees animate fast (150ms), small trees take their time (500ms).
              const dynamicSpeed = Math.max(150, Math.min(500, 4000 / totalNodes));
              
              interval = setInterval(() => {
                setVisibleCount(prev => {
                  if (prev < totalNodes) return prev + 1; // Reveal next node
                  clearInterval(interval); // Stop when whole tree is built
                  return prev;
                });
              }, dynamicSpeed); 
              
            } else {
              // Manual mode: reveal all nodes to D3 and let D3 handle the collapsing
              setVisibleCount(totalNodes);
            }
            return () => clearInterval(interval);
          }, [mode, totalNodes]);

          // --- 3. TREE PRUNER ---
          // Feeds the visible nodes to D3 one by one based on the timer
          const buildVisibleTree = (node: any, limit: number): any => {
            if (node._seq > limit) return null;
            const visibleNode = { ...node };
            if (visibleNode.children) {
              visibleNode.children = visibleNode.children
                .map((c: any) => buildVisibleTree(c, limit))
                .filter(Boolean); // Remove hidden branches
            }
            return visibleNode;
          };

          const treeData = buildVisibleTree(sequencedData, visibleCount) || { name: 'Loading...' };

          // --- 4. BEAUTIFUL CUSTOM NODES ---
          const renderCustomNode = ({ nodeDatum, toggleNode }: any) => {
            const depth = nodeDatum?.__rd3t?.depth || 0;
            const isCollapsed = nodeDatum?.__rd3t?.collapsed || false;
            
            let nodeClasses = "bg-white/90 border-gray-200 text-text-dark shadow-sm";
            if (depth === 0) nodeClasses = "bg-gradient-to-br from-primary-500 to-secondary-500 border-none text-white shadow-glow";
            else if (depth === 1) nodeClasses = "bg-primary-50 border-primary-200 text-primary-800 shadow-sm";

            return (
              <g>
                <foreignObject x="-80" y="-30" width="160" height="60">
                  <div
                    onClick={mode === 'manual' ? toggleNode : undefined}
                    className={`w-full h-full flex flex-col items-center justify-center p-2 text-center border transition-all duration-300 rounded-xl ${nodeClasses} ${mode === 'manual' ? 'cursor-pointer hover:scale-105 hover:bg-white' : ''}`}
                    style={{ fontSize: depth === 0 ? '13px' : '12px', lineHeight: '1.2' }}
                  >
                    <span className="font-bold line-clamp-2">{nodeDatum?.name || "Topic"}</span>
                    
                    {/* The + Indicator for manual mode */}
                    {nodeDatum?.children && nodeDatum.children.length > 0 && isCollapsed && mode === 'manual' && (
                      <div className="absolute -bottom-2 bg-secondary-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                        +
                      </div>
                    )}
                  </div>
                </foreignObject>
              </g>
            );
          };

          return (
            <div className="flex flex-col h-full w-full">
              <style>{`
                .rd3t-link { stroke: #cbd5e1 !important; stroke-width: 2.5px !important; }
              `}</style>

              <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <h3 className="font-semibold text-text-dark flex items-center gap-3">
                  {isFullscreen ? '🧠 Article Hierarchy Map' : 'Hierarchy Map'}
                  
                  <div className="flex bg-white/40 border border-white/55 shadow-glass-sm rounded-lg p-1">
                    <button 
                      onClick={() => setMode('manual')} 
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                    >
                      Manual
                    </button>
                    <button 
                      onClick={() => setMode('auto')} 
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'auto' ? 'bg-primary-500 text-white shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                    >
                      Auto-Play ▶
                    </button>
                  </div>
                </h3>

                {!isFullscreen && (
                  <button onClick={() => setIsMindMapFullScreen(true)} className="p-1.5 bg-white/60 hover:bg-white text-text-dark rounded-lg shadow-sm border border-gray-200 transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div ref={containerRef} className={`flex-1 rounded-xl overflow-hidden relative ${isFullscreen ? 'bg-[#fdfcf4]' : 'bg-white/40'} shadow-inner border border-white/60`}>
                <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 text-xs font-semibold text-text-dark shadow-sm">
                  {mode === 'manual' ? '🖱️ Click nodes to open branches • Scroll to zoom' : '🍿 Watching mind map grow...'}
                </div>

                <Tree
                  key={mode} 
                  data={treeData}
                  translate={translate}
                  orientation="horizontal"
                  renderCustomNodeElement={renderCustomNode}
                  pathFunc="step" 
                  initialDepth={mode === 'auto' ? 10 : 1} 
                  nodeSize={{ x: 220, y: 90 }} 
                  separation={{ siblings: 1, nonSiblings: 1.1 }}
                  transitionDuration={5000} 
                /> 
              </div>
            </div>
          );
        };

        return (
          <>
            <div className="h-full relative flex flex-col"><MindMapRenderer isFullscreen={false} /></div>
            
            {isMindMapFullScreen && createPortal(
              <div className="fixed inset-0 z-[99999] bg-gray-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
                <div className="bg-gray-50 w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl relative flex flex-col p-4 md:p-8 border border-white/20">
                  <button 
                    onClick={() => setIsMindMapFullScreen(false)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <MindMapRenderer isFullscreen={true} />
                </div>
              </div>,
              document.body
            )}
          </>
        );
      }


      case 'flowchart': {
        const flowSteps = paperData.flowchartData || [];
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-text-dark">Process Flowchart</h3>
            {flowSteps.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500/20 before:via-secondary-500/40 before:to-transparent">
                {flowSteps.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-bold shadow-glow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {item.step || idx + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/50 bg-white/35 shadow-glass">
                      <p className="text-sm text-text-dark">{item.process}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No flowchart data generated.</p>
            )}
          </div>
        );
      }

      case 'highlights': {
        const highlights = paperData.highlightsData || [];
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-text-dark">Key highlights</h3>
            {highlights.length > 0 ? (
              <ul className="space-y-3 list-none">
                {highlights.map((sentence: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-text-dark leading-relaxed bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 shadow-glass"
                  >
                    {sentence}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No highlights available.</p>
            )}
          </div>
        );
      }

      case 'notes': {
        const notes = paperData.notesData || [];
        if (notes.length === 0) return <p className="text-sm text-text-muted">No notes generated.</p>;

        const NotesContent = () => (
          <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-10 shrink-0">
              <h3 className="font-semibold text-text-dark flex items-center gap-2">
                <span>📝 Smart Notes</span>
                <span className="text-xs bg-primary-500/20 text-primary-600 px-2 py-1 rounded-full">
                  Page {currentNotePage + 1} of {notes.length}
                </span>
              </h3>
              <div className="flex gap-2">
                <button onClick={handleDownloadPDF} className="p-2 bg-white/50 hover:bg-white rounded-lg transition-colors shadow-sm" title="Download PDF">
                  <Download className="w-4 h-4 text-text-dark" />
                </button>
                {!isNotesExpanded && (
                  <button onClick={() => setIsNotesExpanded(true)} className="p-2 bg-white/50 hover:bg-white rounded-lg transition-colors shadow-sm" title="Full Screen">
                    <Maximize2 className="w-4 h-4 text-text-dark" />
                  </button>
                )}
              </div>
            </div>

            {/* Book Container - Locked to prevent pushing PDF out */}
            <div className="relative flex-1 book-container cursor-pointer select-none">
              {notes.map((pageContent: string, idx: number) => {
                const isFlipped = idx < currentNotePage;
                const isCurrent = idx === currentNotePage;
                const stackStyle = isCurrent ? {} : { top: `${(idx - currentNotePage) * 3}px`, left: `${(idx - currentNotePage) * 3}px`, zIndex: notes.length - idx };

                return (
                  <div 
                    key={idx}
                    className={`absolute inset-0 w-full h-full book-page real-notebook-paper rounded-r-xl border border-gray-300 py-6 shadow-lg ${isFlipped ? 'flipped' : ''} ${isZoomedIn ? 'zoomed-in' : ''}`}
                    
                    style={!isFlipped ? stackStyle : { zIndex: idx }}
                    onClick={() => {
                      if (isCurrent && currentNotePage < notes.length - 1) setCurrentNotePage(prev => prev + 1);
                      else if (!isCurrent && idx > currentNotePage) setCurrentNotePage(idx);
                    }}
                  >
                    <div className="font-handwritten" dangerouslySetInnerHTML={formatNoteText(pageContent)} />
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 z-10 shrink-0">
              <button 
                onClick={() => setCurrentNotePage(Math.max(0, currentNotePage - 1))}
                disabled={currentNotePage === 0}
                className="text-sm font-medium text-text-dark hover:text-primary-600 disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Page
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents flipping the page when clicking the button
                  setIsZoomedIn(!isZoomedIn);
                }}
                className="px-4 py-1.5 bg-white/60 hover:bg-white text-text-dark text-sm font-bold rounded-lg shadow-sm border border-white/50 transition-all"
              >
                {isZoomedIn ? '🔍 Zoom Out (Fit Page)' : '🔍 Zoom In (Read)'}
              </button>

              <p className="text-xs text-text-muted font-medium">Click page to flip</p>
            </div>
          </div>
        );

        return (
          <>
            {/* Standard Layout - Next to PDF */}
            <div className="h-full relative flex flex-col">{NotesContent()}</div>
            
            {/* HIDDEN CONTAINER FOR PDF GENERATION */}
            <div id="hidden-print-container" style={{ display: 'none', width: '800px', backgroundColor: '#fcfcf5' }}>
              {notes.map((pageContent: string, idx: number) => (
                <div key={idx} className="real-notebook-paper py-8 mb-8" style={{ minHeight: '1122px', pageBreakAfter: 'always' }}>
                  <div className="font-handwritten text-xl pr-6" dangerouslySetInnerHTML={formatNoteText(pageContent)} />
                </div>
              ))}
            </div>

            {/* TRUE FULL SCREEN PORTAL - Covers entire screen including PDF */}
            {isNotesExpanded && createPortal(
              <div className="fixed inset-0 z-[99999] bg-gray-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12">
                <div className="bg-gray-100 w-full max-w-5xl h-[95vh] rounded-2xl shadow-2xl relative flex flex-col p-6 md:p-10 border border-white/20">
                  <button 
                    onClick={() => setIsNotesExpanded(false)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  {NotesContent()}
                </div>
              </div>,
              document.body
            )}
          </>
        );
      }

      
      case 'quiz': {
        const quiz = paperData.quizData || [];
        if (quiz.length === 0) return <p className="text-sm text-text-muted">No quiz generated.</p>;

        if (quizFinished) {
          return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl shadow-glow">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-text-dark mb-2">Quiz Completed!</h3>
              <p className="text-text-muted mb-8">You scored {quizScore} out of {quiz.length}</p>
              <button
                onClick={() => {
                  setCurrentQuizIdx(0);
                  setSelectedOption(null);
                  setShowQuizResult(false);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
                className="btn-primary !py-3 !px-8"
              >
                Retake Quiz
              </button>
            </div>
          );
        }

        const currentQuestion = quiz[currentQuizIdx];

        return (
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-text-dark">Knowledge Check</h3>
              <span className="text-sm font-medium text-primary-600 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                Question {currentQuizIdx + 1} of {quiz.length}
              </span>
            </div>

            <div className="bg-white/40 border border-white/55 rounded-2xl p-6 shadow-glass flex-1">
              <p className="font-semibold text-lg text-text-dark mb-6">{currentQuestion.question}</p>
              
              <div className="space-y-3">
                {currentQuestion.options?.map((opt: string, oIdx: number) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = showQuizResult && opt === currentQuestion.answer;
                  const isWrong = showQuizResult && isSelected && opt !== currentQuestion.answer;

                  // Dynamic styles based on interaction state
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
                  if (!showQuizResult) {
                    btnClass += isSelected 
                      ? "bg-primary-500/20 border-primary-500 text-primary-700 shadow-sm" 
                      : "bg-white/50 border-white/40 hover:bg-white/80 text-text-dark hover:border-white/80";
                  } else {
                    if (isCorrect) btnClass += "bg-green-500/20 border-green-500 text-green-800 font-medium";
                    else if (isWrong) btnClass += "bg-red-500/20 border-red-500 text-red-800 line-through opacity-70";
                    else btnClass += "bg-white/30 border-white/20 text-text-muted opacity-50";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={showQuizResult}
                      onClick={() => setSelectedOption(opt)}
                      className={btnClass}
                    >
                      <span className="font-bold mr-3 opacity-70">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-white/40 flex justify-end">
                {!showQuizResult ? (
                  <button
                    disabled={!selectedOption}
                    onClick={() => {
                      setShowQuizResult(true);
                      if (selectedOption === currentQuestion.answer) setQuizScore(prev => prev + 1);
                    }}
                    className="btn-primary !py-2.5 !px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentQuizIdx < quiz.length - 1) {
                        setCurrentQuizIdx(prev => prev + 1);
                        setSelectedOption(null);
                        setShowQuizResult(false);
                      } else {
                        setQuizFinished(true);
                      }
                    }}
                    className="btn-primary !py-2.5 !px-6"
                  >
                    {currentQuizIdx < quiz.length - 1 ? 'Next Question' : 'View Results'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'flashcards': {
        const flashcards = paperData.flashcardsData || [];
        if (flashcards.length === 0) return <p className="text-sm text-text-muted">No flashcards generated.</p>;

        const currentCard = flashcards[currentCardIdx];
        
        // Array of modern gradient colors to make cards colorful
        const colorGradients = [
          'from-blue-500 to-cyan-400',
          'from-purple-500 to-pink-500',
          'from-orange-500 to-red-500',
          'from-emerald-500 to-teal-400',
          'from-indigo-500 to-purple-500'
        ];
        const activeGradient = colorGradients[currentCardIdx % colorGradients.length];

        return (
          <div className="space-y-6 flex flex-col h-full items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="font-semibold text-text-dark">Study Flashcards</h3>
              <span className="text-sm font-medium text-text-muted bg-white/40 px-3 py-1 rounded-full border border-white/55 shadow-glass">
                Card {currentCardIdx + 1} of {flashcards.length}
              </span>
            </div>

            {/* 3D Animated Flashcard Container */}
            <div 
              className="relative w-full max-w-sm aspect-[4/3] cursor-pointer perspective-1000 mt-4"
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-full h-full transition-transform duration-500 relative shadow-glass-lg rounded-2xl"
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                }}
              >
                {/* Front side (Question) */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br ${activeGradient} text-white border border-white/20`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="absolute top-4 right-5 text-xs font-bold uppercase tracking-widest opacity-60">Question</span>
                  <p className="text-xl font-bold leading-snug">{currentCard.question}</p>
                  <p className="absolute bottom-4 text-xs font-medium opacity-75 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Click to flip
                  </p>
                </div>

                {/* Back side (Answer) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white/90 backdrop-blur-md border border-white/60 shadow-inner"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="absolute top-4 right-5 text-xs font-bold uppercase tracking-widest text-primary-500 opacity-80">Answer</span>
                  <p className="text-lg font-medium text-text-dark leading-snug">{currentCard.answer}</p>
                  <p className="absolute bottom-4 text-xs font-medium text-text-muted flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Click to flip back
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setTimeout(() => setCurrentCardIdx(Math.max(0, currentCardIdx - 1)), 150);
                }}
                disabled={currentCardIdx === 0}
                className="p-3 rounded-full bg-white/50 hover:bg-white border border-white/50 text-text-dark disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setTimeout(() => setCurrentCardIdx(Math.min(flashcards.length - 1, currentCardIdx + 1)), 150);
                }}
                disabled={currentCardIdx === flashcards.length - 1}
                className="p-3 rounded-full bg-white/50 hover:bg-white border border-white/50 text-text-dark disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        );
      }

      case 'glossary': {
        const glossary = paperData.glossaryData || [];
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-text-dark">Key Terms</h3>
              
              {/* Language Toggle Switch */}
              <div className="flex bg-white/40 border border-white/55 rounded-lg p-1 shadow-glass-sm">
                <button
                  onClick={() => setGlossaryLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${glossaryLang === 'en' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setGlossaryLang('hinglish')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${glossaryLang === 'hinglish' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
                >
                  Hinglish
                </button>
              </div>
            </div>

            {glossary.length > 0 ? (
              <div className="space-y-3">
                {glossary.map((item: any, idx: number) => {
                  // Dynamically choose the definition based on the toggle
                  const definitionText = glossaryLang === 'en' 
                    ? item.definition 
                    : (item.definitionHinglish || item.definition);
                  
                  return (
                    <div key={idx} className="bg-white/40 border border-white/55 rounded-xl p-4 shadow-glass flex flex-col transition-all hover:bg-white/60">
                      <span className="font-bold text-sm text-secondary-600 mb-1">{item.term}</span>
                      <span className="text-sm text-text-dark">{definitionText}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No glossary terms generated.</p>
            )}
          </div>
        );
      }

      case 'figures': {
        const figures = paperData.figuresData || []; 
        const currentFig = figures[currentFigureIndex];

        if (figures.length === 0) {
          return <p className="text-sm text-text-muted p-4">No charts or figures identified.</p>;
        }

        const FigureExplainer = ({ isFullscreen }: { isFullscreen: boolean }) => {
          const hasAnnotations = currentFig.annotations && currentFig.annotations.length > 0;

          return (
            <div className="flex flex-col h-full w-full overflow-hidden">
              <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <h3 className="font-semibold text-text-dark truncate pr-2">
                  Figure {currentFigureIndex + 1}: {currentFig.figure_title}
                </h3>
                {!isFullscreen && (
                  <button onClick={() => setIsFiguresFullScreen(true)} className="p-1.5 bg-white/60 hover:bg-white rounded-lg border shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className={`flex-1 flex gap-6 transition-all duration-300 min-h-0 overflow-hidden ${isFullscreen ? 'flex-row' : 'flex-col'}`}>
                
                {/* LEFT SIDE: Image + Direct Annotations */}
                <div className={`relative border border-slate-200 shadow-glass-sm rounded-xl bg-slate-50 flex items-center justify-center p-8 group ${isFullscreen ? 'flex-1' : 'h-[60%] shrink-0'}`}>
                  
                  {!hasAnnotations && (
                    <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-md shadow-sm text-xs font-medium text-slate-600">
                      No annotations — see Key Inference panel
                    </div>
                  )}

                  <div className="relative inline-block max-w-[55%] max-h-full">
                    <img 
                      src={currentFig.imageBase64} 
                      alt={currentFig.figure_title}
                      className="block w-full h-auto max-h-full object-contain shadow-sm border border-slate-200 bg-white" 
                    />
                    
                    {/* SVG overlay sits directly on the image, percentages map 1:1 */}
                    {hasAnnotations && (
                      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible">
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                          </marker>
                        </defs>

                        {currentFig.annotations.map((ann: any, idx: number) => {
                          const [dotX, dotY] = ann.coords || [0, 0];
                          const isLeft = dotX < 50;
                          const lineStartX = isLeft ? -15 : 115; 

                          return (
                            <g key={`line-${idx}`}>
                              <line 
                                x1={`${lineStartX}%`} y1={`${dotY}%`} 
                                x2={`${dotX}%`} y2={`${dotY}%`} 
                                stroke="#3b82f6" strokeWidth="2" strokeDasharray="4"
                                markerEnd="url(#arrow)" 
                              />
                              <circle cx={`${dotX}%`} cy={`${dotY}%`} r="4" fill="#1d4ed8" className="animate-pulse" />
                            </g>
                          );
                        })}
                      </svg>
                    )}

                    {/* HTML Overlay Boxes */}
                    {hasAnnotations && currentFig.annotations.map((ann: any, idx: number) => {
                      const [dotX, dotY] = ann.coords || [0, 0];
                      const isLeft = dotX < 50;

                      return (
                        <div 
                          key={`box-${idx}`}
                          className="absolute z-20 w-40 sm:w-48 bg-white/95 backdrop-blur-sm border border-slate-300 shadow-lg p-3 rounded-xl hover:scale-105 transition-transform"
                          style={{
                            top: `${dotY}%`,
                            left: isLeft ? 'auto' : '115%',
                            right: isLeft ? '115%' : 'auto',
                            transform: 'translateY(-50%)' 
                          }}
                        >
                          <span className="block font-bold text-slate-800 text-xs mb-1 leading-tight">{ann.label}</span>
                          <span className="block text-slate-600 text-[10px] sm:text-xs leading-snug">{ann.explanation}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT SIDE: Key Inference */}
                <div className={`space-y-4 overflow-y-auto custom-scrollbar pr-2 ${isFullscreen ? 'w-1/3 border-l border-slate-200 pl-6' : 'flex-1'}`}>
                  <div className="bg-white/60 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold text-sm text-slate-800 mb-3">Key Inference</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 marker:text-primary-500">
                      {(currentFig.inference || '').split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                        <li key={i}>{line.replace(/^-/, '').trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-3 shrink-0">
                <button onClick={() => setCurrentFigureIndex(Math.max(0, currentFigureIndex - 1))} disabled={currentFigureIndex === 0} className="text-sm font-medium text-gray-600 hover:text-primary-600 disabled:opacity-30 flex gap-1 items-center">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <p className="text-xs text-gray-500 font-medium">{currentFigureIndex + 1} of {figures.length}</p>
                <button onClick={() => setCurrentFigureIndex(Math.min(figures.length - 1, currentFigureIndex + 1))} disabled={currentFigureIndex === figures.length - 1} className="text-sm font-medium text-gray-600 hover:text-primary-600 disabled:opacity-30 flex gap-1 items-center">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        };

        return (
          <>
            <div className="h-full relative flex flex-col"><FigureExplainer isFullscreen={false} /></div>
            
            {isFiguresFullScreen && createPortal(
              <div className="fixed inset-0 z-[99999] bg-gray-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12">
                <div className="bg-[#fdfcf4] w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl relative flex flex-col p-6 md:p-10 border border-white/20">
                  <button onClick={() => setIsFiguresFullScreen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-50">
                    <X className="w-6 h-6" />
                  </button>
                  <FigureExplainer isFullscreen={true} />
                </div>
              </div>,
              document.body
            )}
          </>
        );
      }


      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="border-b border-white/25 flex gap-1 overflow-x-auto hide-scrollbar bg-white/10 px-1 pt-1 rounded-t-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-3 whitespace-nowrap text-sm font-medium rounded-t-xl transition-all ${
              activeTab === tab.name
                ? 'bg-white/45 text-text-dark shadow-glass border border-white/50 border-b-0 -mb-px relative z-10'
                : 'text-text-muted hover:text-text-dark hover:bg-white/20 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 min-h-0">{renderContent()}</div>

      <div className="p-4 border-t border-white/25 bg-white/10">
        <button
          type="button"
          onClick={onChatOpen}
          className="btn-primary w-full !py-3 !px-4 text-sm inline-flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
}
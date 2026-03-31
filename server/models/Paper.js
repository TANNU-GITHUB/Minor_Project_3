import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  originalText: { type: String },
  summary: { type: String },
  summaryHinglish: { type: String }, 
  difficulty: { type: String },
  
  mindMapData: { type: mongoose.Schema.Types.Mixed },
  
  flowchartData: { type: Array },
  notesData: { type: Array },
  flashcardsData: { type: Array },
  glossaryData: { type: Array },
  quizData: { type: Array },
  highlightsData: { type: Array },
  figuresData: { type: Array, default: [] }, 
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Paper', paperSchema);
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { Shapes3D } from '../components/Shapes3D';
import { Upload, Search, Filter, Loader2 } from 'lucide-react';

const displayName = 'Tannu';

export function PapersPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Trigger the hidden file input when the button is clicked
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the actual file selection and API request
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ensure it's a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    // Prepare the file to be sent to the backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send POST request to your new local backend
      const response = await axios.post('http://localhost:5000/api/papers/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload Success:', response.data);
      
      // Get the ID of the newly saved paper from the database
      const newPaperId = response.data.paper._id;

      // Navigate to the study page, passing the paper ID in the URL
      navigate(`/study/${newPaperId}`);
      
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Failed to process the paper. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      <FloatingOrbs />
      <Shapes3D />

      <Sidebar userName={displayName} />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <TopBar userName={displayName} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-display text-text-dark mb-2">Study Space</h1>
              <p className="text-text-muted">Manage and organize your research papers</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  className="input-glass pl-11 py-2.5 text-sm"
                />
              </div>
              <button
                type="button"
                className="btn-secondary inline-flex items-center justify-center gap-2 shrink-0"
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="btn-primary inline-flex items-center justify-center gap-2 text-sm !py-3 !px-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? 'Processing AI...' : 'Upload Paper'}
              </button>
            </div>

            {error && (
              <div className="mb-6 glass rounded-2xl p-4 border border-red-400/40 bg-red-500/10 text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/30 to-secondary-500/30 border border-white/40 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">No papers yet</h3>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                Upload your first research paper to get started
              </p>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="btn-primary inline-flex items-center gap-2 text-sm !py-3 !px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? 'Extracting & Summarizing...' : 'Upload Paper'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
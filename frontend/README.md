# Lumina-PDF: AI-Powered Research Paper Study Platform

A beautiful, modern web application for studying research papers with AI assistance, interactive tools, and glassmorphism design aesthetics.

## 🎨 Design Features

### Glassmorphism + 3D Elements
- Frosted glass UI components with backdrop blur effects
- Animated gradient mesh background that shifts across the page
- 6 floating blur orbs with organic drift animations
- 3D geometric shapes (cubes, spheres, pyramids) with perspective transforms
- Subtle noise grain texture overlay for refined aesthetics

### Color Palette
- **Primary**: Teal (#2dd4bf) - Main CTAs and highlights
- **Secondary**: Indigo (#818cf8) - Accents and gradients
- **Accent Pink**: #f472b6 - Badges and highlights
- **Text**: Dark (#1e293b) for body, Muted (#64748b) for secondary
- **Gradients**: Soft transitions between mint, teal, lavender, and peach

### Typography
- **Display**: Clash Display (bold, modern)
- **Headings**: Sora (geometric, clean)
- **Body**: DM Sans (readable, friendly)
- **Monospace**: JetBrains Mono (code/labels)

## 🚀 Features

### Authentication
- Email/password signup and login
- Supabase authentication integration
- "Remember Me" functionality
- Password visibility toggle
- Error handling with user feedback
- Responsive split-screen login design with animated hero section

### Dashboard
- **Welcome Section**: Personalized greeting with user avatar
- **Recent Paper Card**: Progress tracking with animated progress bar
- **Study Stats**: Animated counters showing papers read, quizzes completed, notes created
- **AI Chat Access**: Quick access to AI chat assistant
- **Mind Map Preview**: Visual node-based diagram
- **Quick Action Cards**: Colored stat cards with icons
- **Upload Banner**: Call-to-action for new papers

### Paper Study View
- **Split Layout**: 40% PDF viewer / 60% tools panel (responsive)
- **Page Navigation**: Previous/next buttons with page counter
- **Tabbed Interface**: Summary, Mind Map, Notes, Quiz, Flashcards, Glossary
- **AI Chat Sidebar**: Collapsible chat with typing indicators
- **Interactive Tabs**: Smooth transitions and content management

### Navigation
- Sidebar navigation (responsive - collapsible on mobile)
- Top bar with search, notifications, and user profile
- Bottom navigation bar for mobile views
- Smooth animations and hover effects
- Active state highlighting

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for PDFs)
- **Real-time**: Supabase Realtime (prepared for future use)

### Database Schema
```
users (profile data)
├── papers (uploaded research papers)
├── study_sessions (tracking)
├── notes (user annotations)
├── flashcards (study aids)
├── quiz_attempts (performance)
├── mind_maps (visual representations)
└── chat_history (AI conversations)
```

All tables have Row Level Security (RLS) enabled to ensure user data isolation.

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthForm.tsx              # Login/signup form
│   ├── ChatSidebar.tsx           # AI chat interface
│   ├── DashboardCards.tsx        # Dashboard card grid
│   ├── FloatingOrbs.tsx          # Animated background orbs
│   ├── FloatingPDF.tsx           # 3D floating PDF element
│   ├── Shapes3D.tsx              # 3D geometric shapes
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── TabPanel.tsx              # Study view tabs
│   └── TopBar.tsx                # Header with user info
├── pages/
│   ├── LoginPage.tsx             # Login/signup page
│   ├── DashboardPage.tsx         # Main dashboard
│   ├── PapersPage.tsx            # Papers library
│   ├── StudyPage.tsx             # Paper study interface
│   └── PlaceholderPage.tsx       # Template for other pages
├── lib/
│   └── supabase.ts               # Supabase client & types
├── App.tsx                        # Main app with routing
├── index.css                      # Global styles & animations
└── main.tsx                       # Entry point
```

## 🎯 Key Pages

### 1. Login Page (`/login`)
- Split-screen design: hero on left, form on right
- Floating 3D PDF visualization
- Toggle between Sign In and Sign Up modes
- Social login buttons (Google, GitHub - styled)
- Animated background orbs and shapes

### 2. Dashboard (`/dashboard`)
- Home page showing user's learning progress
- Recent paper with progress tracking
- Statistics cards with count-up animations
- AI chat quick access
- Mind map preview
- Promotional banner for paper uploads
- Responsive grid layout

### 3. Papers Library (`/papers`)
- Upload interface (placeholder in demo)
- Search and filter functionality
- Grid view of uploaded papers
- Paper metadata display

### 4. Study View (`/study/:paperId`)
- **Left Panel**: PDF viewer with page navigation
- **Right Panel**: Interactive tabs for different study modes
  - **Summary**: AI-generated overview and key findings
  - **Mind Map**: Visual concept mapping
  - **Notes**: Annotated notes with page references
  - **Quiz**: Multiple choice questions
  - **Flashcards**: Flip-card study aids
  - **Glossary**: Term definitions
- **Chat Sidebar**: AI assistant for paper-specific questions

### 5. Placeholder Pages
- `/mind-maps`: Mind Maps interface
- `/flashcards`: Flashcard study system
- `/notes`: Notes archive
- `/progress`: Learning analytics
- `/settings`: User preferences

## 🎨 Responsive Design

### Breakpoints
- **Mobile** (<768px): Single column, bottom nav, full-width cards
- **Tablet** (768-1200px): Collapsible sidebar, 2-column grid
- **Desktop** (>1200px): Fixed sidebar, 3-column grid, full features

### Adaptive Features
- Hamburger menu on mobile/tablet
- Collapsible sidebar that slides in
- Stack layouts on small screens
- Touch-friendly button sizes (44x44px minimum)
- Responsive typography scaling

## ✨ Micro-Interactions

### Animations
- **Cards**: Hover lift with shadow deepening
- **Buttons**: Shimmer sweep overlay, click scale feedback
- **Inputs**: Focus glow ring, color transition
- **Progress**: Animated width transitions
- **Counters**: Number count-up on mount
- **Tabs**: Border and color transitions
- **Chat**: Typing indicator with bouncing dots
- **Background**: Continuous gradient mesh animation
- **Floating Elements**: Organic drift with staggered timing

## 🔐 Security

### Authentication
- Supabase email/password auth
- JWT-based sessions
- Protected routes (redirect to login if not authenticated)
- User data isolation via RLS policies

### Database
- Row Level Security (RLS) on all tables
- Policies check `auth.uid()` for ownership
- No public data exposure
- Foreign key constraints for data integrity

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build
```bash
npm run build
```

### Production
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are already configured in the project.

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `@supabase/supabase-js` - Database & auth

### UI & Icons
- `lucide-react` - Icon library
- `tailwindcss` - Utility-first CSS

### Dev
- `typescript` - Type safety
- `vite` - Build tool
- `eslint` - Code linting

## 🎓 Learning Resources

The application is fully structured to support:
- PDF annotation and highlighting
- AI-powered paper summarization
- Interactive concept mapping
- Spaced repetition learning
- Progress tracking and analytics
- Collaborative study notes

## 🎨 Customization

### Colors
Modify in `tailwind.config.js`:
```javascript
colors: {
  primary: { 500: '#2dd4bf' },
  secondary: { 500: '#818cf8' },
  // ...
}
```

### Fonts
Fonts are loaded from Google Fonts in `index.css`. Add more fonts as needed.

### Animations
Custom animations defined in `index.css` and `tailwind.config.js`:
```css
@keyframes gradientShift { /* ... */ }
@keyframes float { /* ... */ }
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Limitations

- PDF rendering is a placeholder (use react-pdf or pdfjs for full PDF support)
- AI responses are simulated (integrate with OpenAI or similar)
- Social login (Google, GitHub) requires additional setup
- File upload infrastructure needs Supabase Storage setup

## 🔮 Future Enhancements

- Real PDF processing and OCR
- AI-powered summarization with Claude/GPT
- WebSockets for real-time collaboration
- PDF annotation tools
- Export to various formats
- Dark mode support
- Paper recommendation engine
- Community features (sharing, discussions)

## 📄 License

This project is part of a learning platform demonstration.

---

**Built with glassmorphism design principles, modern React patterns, and attention to delightful micro-interactions.**

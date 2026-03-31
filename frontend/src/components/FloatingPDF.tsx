export function FloatingPDF() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes floatDoc {
          0%, 100% { transform: perspective(800px) rotateX(15deg) rotateY(-20deg) translateY(0px); }
          50% { transform: perspective(800px) rotateX(15deg) rotateY(-20deg) translateY(-18px); }
        }

        @keyframes orbitDot1 {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          100% { transform: translateX(80px) translateY(80px) rotate(360deg); }
        }

        @keyframes orbitDot2 {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          100% { transform: translateX(-100px) translateY(60px) rotate(-360deg); }
        }

        @keyframes orbitDot3 {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          100% { transform: translateX(60px) translateY(-90px) rotate(360deg); }
        }

        .float-doc {
          animation: floatDoc 5s ease-in-out infinite;
        }

        .orbit-container {
          position: relative;
          width: 240px;
          height: 280px;
        }

        .orbit-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 8px rgba(45, 212, 191, 0.8);
          top: 50%;
          left: 50%;
          margin: -4px 0 0 -4px;
        }

        .orbit-dot:nth-child(1) {
          animation: orbitDot1 8s linear infinite;
        }

        .orbit-dot:nth-child(2) {
          animation: orbitDot2 10s linear infinite;
          animation-delay: -3s;
        }

        .orbit-dot:nth-child(3) {
          animation: orbitDot3 12s linear infinite;
          animation-delay: -6s;
        }
      `}</style>

      <div className="orbit-container float-doc">
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-xl"
          style={{
            boxShadow: '0 20px 40px rgba(31, 38, 135, 0.2), 0 0 40px rgba(45, 212, 191, 0.15)',
            border: '2px solid rgba(45, 212, 191, 0.3)',
          }}
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <div className="h-2 bg-gray-200 rounded flex-1" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-2 bg-gray-100 rounded" />
              <div className="h-2 bg-gray-100 rounded w-4/5" />
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500/40" />
            </div>
          </div>
        </div>

        <div className="orbit-dot" />
        <div className="orbit-dot" />
        <div className="orbit-dot" />
      </div>
    </div>
  );
}

export function Shapes3D() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      <style>{`
        @keyframes floatCube {
          0%, 100% { transform: perspective(1000px) rotateX(0) rotateY(0deg) translateY(0); }
          33% { transform: perspective(1000px) rotateX(10deg) rotateY(90deg) translateY(-15px); }
          66% { transform: perspective(1000px) rotateX(-10deg) rotateY(-90deg) translateY(10px); }
        }

        @keyframes floatSphere {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-25px) translateX(20px) scale(1.05); }
        }

        @keyframes floatPyramid {
          0%, 100% { transform: perspective(800px) rotateX(0) rotateZ(0) translateY(0); }
          50% { transform: perspective(800px) rotateX(20deg) rotateZ(10deg) translateY(-20px); }
        }

        .cube-3d {
          animation: floatCube 8s ease-in-out infinite;
        }

        .sphere-3d {
          animation: floatSphere 6s ease-in-out infinite;
        }

        .pyramid-3d {
          animation: floatPyramid 7s ease-in-out infinite;
        }
      `}</style>

      <div
        className="cube-3d absolute w-20 h-20 rounded-lg top-20 left-10"
        style={{
          background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.1))',
          boxShadow: '0 10px 30px rgba(45, 212, 191, 0.2), inset 2px 2px 8px rgba(255, 255, 255, 0.3)',
        }}
      />

      <div
        className="sphere-3d absolute w-32 h-32 rounded-full top-1/2 right-20"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.3), rgba(129, 140, 248, 0.05))',
          boxShadow: '0 20px 50px rgba(129, 140, 248, 0.2), inset -8px -8px 20px rgba(0, 0, 0, 0.1)',
        }}
      />

      <div
        className="pyramid-3d absolute w-24 h-24 bottom-32 left-1/3"
        style={{
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.35), rgba(244, 114, 182, 0.1))',
          boxShadow: '0 15px 35px rgba(244, 114, 182, 0.2)',
        }}
      />

      <div
        className="sphere-3d absolute w-40 h-40 rounded-full bottom-20 right-1/4"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.02))',
          boxShadow: '0 25px 60px rgba(45, 212, 191, 0.15), inset -10px -10px 25px rgba(0, 0, 0, 0.05)',
          animation: 'floatSphere 9s ease-in-out infinite 2s',
        }}
      />
    </div>
  );
}

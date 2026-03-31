export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="orb-1 absolute w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.1))',
          top: '10%',
          left: '5%',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb-2 absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(129, 140, 248, 0.35), rgba(129, 140, 248, 0.05))',
          top: '20%',
          right: '8%',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="orb-3 absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(244, 114, 182, 0.3), rgba(244, 114, 182, 0.05))',
          top: '60%',
          left: '15%',
          filter: 'blur(85px)',
        }}
      />
      <div
        className="orb-4 absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(45, 212, 191, 0.35), rgba(45, 212, 191, 0.05))',
          bottom: '10%',
          right: '20%',
          filter: 'blur(75px)',
        }}
      />
      <div
        className="orb-5 absolute w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(129, 140, 248, 0.3), rgba(129, 140, 248, 0.05))',
          bottom: '20%',
          left: '40%',
          filter: 'blur(88px)',
        }}
      />
      <div
        className="orb-6 absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(244, 114, 182, 0.25), rgba(244, 114, 182, 0.05))',
          top: '40%',
          right: '25%',
          filter: 'blur(92px)',
        }}
      />
      <div className="grain absolute inset-0 w-full h-full" />
    </div>
  );
}

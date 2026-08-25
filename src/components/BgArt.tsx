function GardenScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFD23F">
        <circle cx="1080" cy="120" r="48" />
        <g stroke="#FFD23F" strokeWidth="7" strokeLinecap="round">
          <line x1="1080" y1="48" x2="1080" y2="26" /><line x1="1080" y1="192" x2="1080" y2="214" />
          <line x1="1008" y1="120" x2="986" y2="120" /><line x1="1152" y1="120" x2="1174" y2="120" />
          <line x1="1029" y1="69" x2="1013" y2="53" /><line x1="1131" y1="171" x2="1147" y2="187" />
          <line x1="1131" y1="69" x2="1147" y2="53" /><line x1="1029" y1="171" x2="1013" y2="187" />
        </g>
      </g>
      <g fill="#FFFFFF" opacity=".85"><ellipse cx="230" cy="130" rx="66" ry="32" /><ellipse cx="296" cy="140" rx="52" ry="28" /><ellipse cx="180" cy="150" rx="42" ry="24" /></g>
      <g fill="#FFFFFF" opacity=".7"><ellipse cx="760" cy="80" rx="52" ry="24" /><ellipse cx="818" cy="90" rx="40" ry="20" /></g>
      <path d="M0 700 Q300 620 600 700 T1200 700 V800 H0 Z" fill="#8FD98A" opacity=".55" />
      <path d="M0 750 Q400 690 800 750 T1200 745 V800 H0 Z" fill="#5EC271" opacity=".5" />
      <g opacity=".55"><circle cx="500" cy="230" r="6" fill="#3AA0FF" /><circle cx="560" cy="300" r="5" fill="#9B6DE0" /><circle cx="140" cy="520" r="6" fill="#FF9F45" /><circle cx="1040" cy="430" r="5" fill="#FF5A5F" /><circle cx="700" cy="520" r="6" fill="#3FBF6F" /></g>
    </svg>
  );
}

function SchoolScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFD23F">
        <circle cx="1080" cy="120" r="44" />
        <g stroke="#FFD23F" strokeWidth="6" strokeLinecap="round">
          <line x1="1080" y1="54" x2="1080" y2="34" /><line x1="1080" y1="186" x2="1080" y2="206" />
          <line x1="1016" y1="120" x2="996" y2="120" /><line x1="1144" y1="120" x2="1164" y2="120" />
        </g>
      </g>
      <g fill="#FFFFFF" opacity=".8"><ellipse cx="210" cy="120" rx="60" ry="28" /><ellipse cx="270" cy="130" rx="46" ry="24" /></g>
      {/* prédio da escola */}
      <g>
        <rect x="430" y="380" width="340" height="260" rx="10" fill="#F6C87A" opacity=".9" />
        <polygon points="410,380 600,290 790,380" fill="#E0794F" opacity=".9" />
        <rect x="580" y="300" width="40" height="50" fill="#B0562F" opacity=".9" />
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={460 + c * 72} y={420 + r * 65} width="44" height="44" rx="4" fill="#BFE6FF" stroke="#5EA8D9" strokeWidth="3" />
          ))
        )}
        <rect x="570" y="560" width="60" height="80" rx="4" fill="#8A5A34" />
      </g>
      {/* mochila e lousa, no chão do jardim */}
      <g transform="translate(870,600)">
        <rect x="0" y="10" width="70" height="80" rx="16" fill="#FF9F45" />
        <rect x="12" y="0" width="46" height="26" rx="10" fill="#FF5A5F" />
        <rect x="20" y="30" width="30" height="40" rx="6" fill="#FFD23F" opacity=".8" />
      </g>
      <g transform="translate(220,560)">
        <rect x="0" y="0" width="120" height="80" rx="8" fill="#2B2630" />
        <rect x="-6" y="72" width="132" height="10" rx="4" fill="#8A5A34" />
        <path d="M18 42 Q40 20 60 42 T104 42" stroke="#F4EDE4" strokeWidth="3" fill="none" opacity=".8" />
      </g>
      <path d="M0 700 Q300 640 600 700 T1200 700 V800 H0 Z" fill="#8FD98A" opacity=".55" />
      <path d="M0 750 Q400 700 800 750 T1200 745 V800 H0 Z" fill="#5EC271" opacity=".5" />
    </svg>
  );
}

const SCENES: Record<string, () => JSX.Element> = { A0: GardenScene, A1: SchoolScene };

export function BgArt({ moduleId = "A0" }: { moduleId?: string }) {
  const Scene = SCENES[moduleId] ?? GardenScene;
  return (
    <div className="bgart" aria-hidden="true">
      <Scene />
    </div>
  );
}

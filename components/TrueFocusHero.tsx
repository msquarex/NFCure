'use client';

import TrueFocus from './TrueFocus';

const TrueFocusHero: React.FC = () => {
  return (
    <div className="mb-8 animate-slide-in-up">
      <TrueFocus 
        sentence="NFC Cure"
        manualMode={false}
        blurAmount={5}
        borderColor="red"
        textColor="gradient-text-holographic"
        animationDuration={2}
        pauseBetweenAnimations={1}
      />
    </div>
  );
};

export default TrueFocusHero;

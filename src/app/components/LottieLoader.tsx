import React from 'react';
import Lottie from 'lottie-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

export type LottieVariant = 'TECHNICAL' | 'SCAN' | 'PULSE';

interface LottieLoaderProps {
  variant?: LottieVariant;
  size?: number;
  className?: string;
}

// Robust local Lottie JSON for the Technical variant to ensure zero-fail demos
// This is a minimal valid Lottie animation of a rotating technical gear/circle
const LOCAL_TECHNICAL_JSON = {
  "v": "5.7.1", "fr": 60, "ip": 0, "op": 120, "w": 100, "h": 100, "nm": "Technical Loader", "ddd": 0, "assets": [],
  "layers": [{
    "ddd": 0, "ind": 1, "ty": 4, "nm": "Ring", "sr": 1, "ks": {
      "o": { "a": 0, "k": 100 }, "r": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 120, "s": [360] }] },
      "p": { "a": 0, "k": [50, 50] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }
    }, "ao": 0, "shapes": [{
      "ty": "gr", "it": [{
        "d": 1, "ty": "el", "s": { "a": 0, "k": [80, 80] }, "p": { "a": 0, "k": [0, 0] }, "nm": "Circle"
      }, {
        "ty": "st", "c": { "a": 0, "k": [0, 0, 0, 1] }, "o": { "a": 0, "k": 15 }, "w": { "a": 0, "k": 2 }, "lc": 1, "lj": 1, "ml": 4, "nm": "Stroke"
      }, {
        "d": 1, "ty": "el", "s": { "a": 0, "k": [60, 60] }, "p": { "a": 0, "k": [0, 0] }, "nm": "Inner"
      }, {
        "ty": "st", "c": { "a": 0, "k": [0, 0, 0, 1] }, "o": { "a": 0, "k": 40 }, "w": { "a": 0, "k": 4 }, "lc": 1, "lj": 1, "ml": 4, "d": { "a": 0, "k": [{ "n": "d", "nm": "dash", "v": { "a": 0, "k": [10, 20] } }] }, "nm": "Dashed"
      }]
    }]
  }]
};

// Local scan animation (scanning radar effect)
const LOCAL_SCAN_JSON = {
  "v": "5.7.1", "fr": 60, "ip": 0, "op": 180, "w": 100, "h": 100, "nm": "Scan Loader", "ddd": 0, "assets": [],
  "layers": [{
    "ddd": 0, "ind": 1, "ty": 4, "nm": "Scanner", "sr": 1, "ks": {
      "o": { "a": 0, "k": 100 }, "r": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 180, "s": [360] }] },
      "p": { "a": 0, "k": [50, 50] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }
    }, "ao": 0, "shapes": [{
      "ty": "gr", "it": [{
        "d": 1, "ty": "el", "s": { "a": 0, "k": [70, 70] }, "p": { "a": 0, "k": [0, 0] }, "nm": "Outer"
      }, {
        "ty": "st", "c": { "a": 0, "k": [0, 0.4, 0.8, 1] }, "o": { "a": 0, "k": 20 }, "w": { "a": 0, "k": 2 }, "lc": 1, "lj": 1, "ml": 4, "nm": "Border"
      }]
    }]
  }]
};

// Local pulse animation (pulsing circle)
const LOCAL_PULSE_JSON = {
  "v": "5.7.1", "fr": 60, "ip": 0, "op": 90, "w": 100, "h": 100, "nm": "Pulse Loader", "ddd": 0, "assets": [],
  "layers": [{
    "ddd": 0, "ind": 1, "ty": 4, "nm": "Pulse", "sr": 1, "ks": {
      "o": { "a": 1, "k": [{ "t": 0, "s": [100] }, { "t": 90, "s": [0] }] },
      "r": { "a": 0, "k": 0 },
      "p": { "a": 0, "k": [50, 50] }, "a": { "a": 0, "k": [0, 0] },
      "s": { "a": 1, "k": [{ "t": 0, "s": [0, 0] }, { "t": 90, "s": [120, 120] }] }
    }, "ao": 0, "shapes": [{
      "ty": "gr", "it": [{
        "d": 1, "ty": "el", "s": { "a": 0, "k": [50, 50] }, "p": { "a": 0, "k": [0, 0] }, "nm": "Circle"
      }, {
        "ty": "st", "c": { "a": 0, "k": [0.2, 0.8, 0.4, 1] }, "o": { "a": 0, "k": 100 }, "w": { "a": 0, "k": 3 }, "lc": 1, "lj": 1, "ml": 4, "nm": "Stroke"
      }]
    }]
  }]
};

// All variants now use local animations for reliability
const LOTTIE_DATA = {
  TECHNICAL: LOCAL_TECHNICAL_JSON,
  SCAN: LOCAL_SCAN_JSON,
  PULSE: LOCAL_PULSE_JSON
};

export const LottieLoader = ({ variant = 'TECHNICAL', size = 120, className }: LottieLoaderProps) => {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(false);

    const loadLottie = async () => {
      // All variants use local animations for reliability
      if (LOTTIE_DATA[variant]) {
        setTimeout(() => {
          if (isMounted) {
            setAnimationData(LOTTIE_DATA[variant]);
            setIsLoading(false);
          }
        }, 100);
        return;
      }

      // Fallback to error state if variant not found
      if (isMounted) {
        console.warn(`Lottie variant ${variant} not found, using fallback`);
        setError(true);
        setIsLoading(false);
      }
    };

    loadLottie();
    return () => { isMounted = false; };
  }, [variant]);

  // High-fidelity SVG Fallbacks that match the "Technical" and "Executive" aesthetic
  const renderFallback = () => (
    <div 
      style={{ width: size, height: size }} 
      className={clsx("flex flex-col items-center justify-center relative overflow-hidden", className)}
    >
      {variant === 'TECHNICAL' ? (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-[80%] h-[80%] border-2 border-dashed border-zinc-200 rounded-full"
          />
          {/* Inner Rotating Hexagon/Diamond */}
          <motion.div 
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
            className="w-[40%] h-[40%] bg-zinc-900/5 border border-zinc-900/20 rounded-lg flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-ping" />
          </motion.div>
          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ['20%', '80%', '20%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[15%] right-[15%] h-[1px] bg-zinc-900/40 shadow-[0_0_8px_rgba(0,0,0,0.2)]"
          />
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-[3px] border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
          <div className="absolute inset-0 border-[3px] border-zinc-900/10 rounded-full" />
        </div>
      )}
      
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-0 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] pt-4"
      >
        {variant === 'TECHNICAL' ? 'Analyzing' : 'Syncing'}
      </motion.span>
    </div>
  );

  if (isLoading || error || !animationData) {
    return renderFallback();
  }

  return (
    <div style={{ width: size, height: size }} className={clsx("relative", className)}>
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
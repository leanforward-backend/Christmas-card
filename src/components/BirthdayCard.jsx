import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function BirthdayCard() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotateY = useTransform(scrollYProgress, [0, 0.8], [0, -180]);

  const rotateX = useTransform(scrollYProgress, [0, 0.8], [0, 180]);

  const translateX = useTransform(scrollYProgress, [0, 0.8], [0, 225]);
  const translateY = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

  const [showTyping, setShowTyping] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const rotation = isMobile ? rotateX : rotateY;
    const unsubscribe = rotation.on("change", (v) => {
      if (isOpen) {
        setShowTyping(true);
      } else if (Math.abs(v) > 90) {
        setShowTyping(true);
      } else {
        setShowTyping(false);
      }
    });

    // Check isOpen immediately
    if (isOpen) setShowTyping(true);

    return () => unsubscribe();
  }, [rotateY, rotateX, isMobile, isOpen]);

  return (
    <div ref={containerRef} className="h-[400vh] relative bg-slate-900">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="w-full max-w-5xl h-[600px] md:h-[600px] perspective-[2000px]">
          <motion.div
            style={{
              x: isMobile ? 0 : translateX,
              y: isMobile ? translateY : 0,
            }}
            className="relative w-full h-full preserve-3d flex items-center justify-center"
          >
            {isMobile ? (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1/2 bg-[#fdfbf7] shadow-2xl p-4 flex flex-col z-10">
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-gray-800 font-bold mb-3 font-['Caveat']">
                        Merry Christmas,
                      </h3>
                      {showTyping && (
                        <TypewriterText text="Wishing you all an amazing christmas, can't belive that it's been a year already since I was over there. Had such a great time with you guys last year, I really appreciated you having me over, you are a wonderful family. Things seem to be going well for me career wise, so hopefully i'll end up working in America in a few years and I'll be able to see you all then!" />
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-lg text-gray-800 font-['Caveat'] font-bold">
                        - Toby.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  onClick={() => setIsOpen(!isOpen)}
                  initial={false}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{
                    transformOrigin: "top center",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1/2 preserve-3d z-20 cursor-pointer"
                >
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-600 to-red-700 shadow-2xl flex flex-col items-center justify-center p-4 border-4 border-green-500">
                    <div className="text-center">
                      <div className="text-5xl mb-3">🎅</div>
                      <h2 className="text-3xl font-bold text-green-500 mb-1 font-['Caveat']">
                        Merry Christmas
                      </h2>
                      <h2 className="text-4xl font-bold text-green-400 font-['Caveat']">
                        from down under
                      </h2>
                      <p className="mt-4 text-white text-opacity-90 text-sm animate-pulse">
                        ↓ Tap to open ↓
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 backface-hidden rotate-x-180 bg-[#fdfbf7] shadow-inner p-4 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">🎄</div>
                      <div className="text-4xl">❄️</div>
                      <div className="text-4xl">🎁</div>
                      <p className="text-lg text-gray-600 font-['Caveat'] mt-3">
                        Have a great christmas in America
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <div className="absolute left-1/4 w-1/2 h-full bg-[#fdfbf7] shadow-2xl p-8 flex flex-col z-10">
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl text-gray-800 font-bold mb-6 font-['Caveat']">
                        Merry Christmas,
                      </h3>

                      {showTyping && (
                        <TypewriterText text="Wishing you all an amazing christmas, can't belive that it's been a year already since I was over there. Had such a great time with you guys last year, I really appreciated you having me over, you are a wonderful family. Things seem to be going well for me career wise, so hopefully i'll end up working in America in a few years and I'll be able to see you all then!" />
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl text-gray-800 font-['Caveat'] font-bold">
                        - Toby
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  style={{
                    rotateY,
                    transformOrigin: "left center",
                  }}
                  className="absolute left-1/4 w-1/2 h-full preserve-3d z-20"
                >
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-600 to-red-700 shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-green-400">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🎅</div>
                      <h2 className="text-6xl font-bold text-green-400 mb-2 font-['Caveat']">
                        Merry Christmas
                      </h2>
                      <h2 className="text-7xl font-bold text-green-300 font-['Caveat']">
                        From down under
                      </h2>
                      <p className="mt-8 text-white text-opacity-90 text-lg animate-pulse">
                        ↓ Scroll to open ↓
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fdfbf7] shadow-inner p-8 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">🎄</div>
                      <div className="text-6xl">❄️</div>
                      <div className="text-6xl">🎁</div>
                      <p className="text-2xl text-gray-600 font-['Caveat'] mt-6">
                        Have a great christmas in America
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); // Reset on mount
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40); // Speed of typing

    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className="text-base md:text-2xl text-gray-700 leading-relaxed font-['Caveat']">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

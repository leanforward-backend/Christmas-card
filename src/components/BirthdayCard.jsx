import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function BirthdayCard() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Start closed (0) and open as you scroll (-180)
  const rotateY = useTransform(scrollYProgress, [0, 0.8], [0, -180]);
  // Move the card to the right as it opens to keep it centered
  const translateX = useTransform(scrollYProgress, [0, 0.8], [0, 225]);
  const [showTyping, setShowTyping] = useState(false);

  // Start typing animation when card is opened
  useEffect(() => {
    const unsubscribe = rotateY.on("change", (v) => {
      if (v < -90) setShowTyping(true);
      else setShowTyping(false);
    });
    return () => unsubscribe();
  }, [rotateY]);

  return (
    <div
      ref={containerRef}
      className="h-[400vh] relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-5xl h-[600px] perspective-[2000px]">
          {/* Card Container */}
          <motion.div
            style={{ x: translateX }}
            className="relative w-full h-full preserve-3d"
          >
            {/* Left Page (Base) - Always visible */}
            <div className="absolute left-1/4 w-1/2 h-full bg-[#fdfbf7] shadow-2xl p-8 flex flex-col z-10">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl text-gray-800 font-bold mb-6 font-['Caveat']">
                    Dearest Dad,
                  </h3>

                  {showTyping && (
                    <TypewriterText text="Wishing you the most amazing birthday! Blah blah blah stuff about dads birthday etc." />
                  )}
                </div>

                <div className="text-right">
                  <p className="text-2xl text-gray-800 font-['Caveat'] font-bold">
                    - Love Toby.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Page/Cover - Opens like a book */}
            <motion.div
              style={{
                rotateY,
                transformOrigin: "left center",
              }}
              className="absolute left-1/4 w-1/2 h-full preserve-3d z-20"
            >
              {/* Front Cover (visible when closed) */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-yellow-400">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎂</div>
                  <h2 className="text-6xl font-bold text-yellow-400 mb-2 font-['Caveat']">
                    Happy Birthday
                  </h2>
                  <h2 className="text-7xl font-bold text-yellow-300 font-['Caveat']">
                    Dad!
                  </h2>
                  <p className="mt-8 text-white text-opacity-90 text-lg animate-pulse">
                    ↓ Scroll to open ↓
                  </p>
                </div>
              </div>

              {/* Inside Right Page (visible when opened) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fdfbf7] shadow-inner p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎉</div>
                  <div className="text-6xl">🎈</div>
                  <div className="text-6xl">🎁</div>
                  <p className="text-2xl text-gray-600 font-['Caveat'] mt-6">
                    May all your wishes come true!
                  </p>
                </div>
              </div>
            </motion.div>
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
    <p className="text-2xl text-gray-700 leading-relaxed font-['Caveat']">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

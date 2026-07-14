import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    let timer: any;
    const activeWord = words[currentWordIdx];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => activeWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-block border-r-2 border-accent pr-1 font-semibold text-accent">
      {currentText || '\u00A0'}
    </span>
  );
};
export default Typewriter;

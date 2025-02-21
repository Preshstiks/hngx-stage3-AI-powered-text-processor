import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const useTyper = (text, speed = 100) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [index, text, speed]);

  return { displayedText, isTyping };
};

const TypingText = ({ text, speed = 100, showCursor = true }) => {
  const { displayedText, isTyping } = useTyper(text, speed);

  return (
    <h1 className="text-[13px]">
      {displayedText}
      {showCursor && isTyping && <span className="blink">|</span>}
    </h1>
  );
};

TypingText.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number,
  showCursor: PropTypes.bool,
};

export default TypingText;

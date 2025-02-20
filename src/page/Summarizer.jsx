import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BeatLoader } from "react-spinners";
import TypingText from "../components/useTyper";
import { PageDropDown } from "../components/DropDown";

const Summarizer = () => {
  const detectorRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [requests, setRequests] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [btnShow, setBtnShow] = useState(true);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const summarizeText = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }
    const newRequest = { text: inputText, loading: true };
    setRequests((prev) => [...prev, newRequest]);
    setInputText("");
    setIsDisabled(true);

    try {
      const summarizer = await window.ai.summarizer.create({
        type: "headline",
        format: "markdown",
        length: "medium",
        context: "This summary is for a tech-savvy audience.",
      });

      const result = await summarizer.summarize(inputText);
      setRequests((prev) =>
        prev.map((request, index) =>
          index === prev.length - 1
            ? { ...request, summary: result, loading: false }
            : request
        )
      );
    } catch (error) {
      console.error("Error summarizing text:", error);
      alert("Failed to generate summary. Please try again.");
      setRequests((prev) =>
        prev.map((request, index) =>
          index === prev.length - 1 ? { ...request, loading: false } : request
        )
      );
    }
  };
  useEffect(() => {
    async function initializeDetector() {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;

      if (canDetect === "no") return;

      let newDetector;
      if (canDetect === "readily") {
        newDetector = await self.ai.languageDetector.create();
      } else {
        newDetector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await newDetector.ready;
      }

      detectorRef.current = newDetector;
    }

    initializeDetector();
  }, []);

  useEffect(() => {
    const detectLanguage = async () => {
      if (!detectorRef.current || inputText.trim() === "") {
        setDetectedLanguage(null);
        return;
      }

      const results = await detectorRef.current.detect(inputText);
      if (results.length > 0) {
        const topResult = results[0];
        setDetectedLanguage({
          language: topResult.detectedLanguage,
          confidence: Math.round(topResult.confidence * 100),
        });
        setBtnShow(topResult.detectedLanguage === "en");
      } else {
        setDetectedLanguage(null);
      }
    };

    // Debounce effect: Run detection only after the user stops typing (500ms delay)
    const timeoutId = setTimeout(detectLanguage, 500);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setIsDisabled(value.trim() === "");
    if (value.trim() === "") {
      setBtnShow(true);
    } else if (detectedLanguage && detectedLanguage.language !== "en") {
      setBtnShow(false);
    } else {
      setBtnShow(true);
    }
  };
  const options = [
    { label: "Translator", path: "/ai/translator" },
    { label: "Summarizer", path: "/ai/summarizer" },
  ];

  return (
    <div className="text-white max-w-[1200px] pb-[200px] w-full px-4 mx-auto min-h-[calc(100vh-64px)]">
      <PageDropDown options={options} defaultSelected="Summarizer" />
      {requests.length === 0 ? (
        <h1 className="py-4 sm:text-[40px] text-[30px] font-poppinsRegular">
          Type what you want to Summarize...
        </h1>
      ) : (
        requests.map((request, index) => (
          <div key={index} className="mb-4">
            <div className="bg-[#101010] rounded-[8px] max-w-[600px] w-full py-3 px-6">
              <p className="font-bold">{request.text}</p>
            </div>
            {request.loading ? (
              <div className="flex justify-end mt-3 mb-10">
                <div className="bg-[#0de8f88e] rounded-[8px] max-w-[600px] w-full py-3 px-6">
                  <BeatLoader color="#373737" size={8} />
                </div>
              </div>
            ) : request.summary ? (
              <div className="flex justify-end mt-3 mb-10">
                <div className="bg-[#0de8f88e] rounded-[8px] max-w-[600px] w-full py-3 px-6">
                  <TypingText text={request.summary} speed={100} />
                </div>
              </div>
            ) : null}
          </div>
        ))
      )}
      <div className="fixed bottom-6 left-1/2 px-4 -translate-x-1/2 z-50 max-w-[700px] w-full">
        <div className="px-4 relative pt-4 pb-8 rounded-[10px] bg-lightPrimary max-w-[700px] w-full">
          <textarea
            value={inputText}
            onChange={handleChange}
            rows={3}
            className="bg-lightPrimary text-[13px] max-w-[700px] w-full resize-none outline-none rounded-[8px]"
          />
          {btnShow && (
            <button
              onClick={summarizeText}
              disabled={isDisabled || requests.some((req) => req.loading)}
              className={`absolute right-2 bottom-2 py-2 px-3 text-[10px] rounded-[8px] font-poppinsRegular ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-secondary cursor-pointer text-white"
              }`}
            >
              Summarize
            </button>
          )}
          <div className="absolute left-2 bottom-2">
            {detectedLanguage && (
              <div className="py-2 px-3 bg-[#00000063]">
                <div className="text-[10px] font-poppinsRegular text-white">
                  {`  Detected language: ${
                    detectedLanguage.language === "en"
                      ? "English"
                      : detectedLanguage.language === "pt"
                      ? "Portuguese"
                      : detectedLanguage.language === "es"
                      ? "Spanish"
                      : detectedLanguage.language === "ru"
                      ? "Russian"
                      : detectedLanguage.language === "tr"
                      ? "Turkish"
                      : detectedLanguage.language === "fr"
                      ? "French"
                      : "No language detected"
                  }`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Summarizer.propTypes = {
  defaultSelected: PropTypes.string,
};

export default Summarizer;

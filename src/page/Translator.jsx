import { useEffect, useRef, useState } from "react";

import LanguageSelect, { PageDropDown } from "../components/DropDown";
import { BsArrowDown, BsArrowRight } from "react-icons/bs";
import AutoDetectIndicator from "../components/AutoDetectIndicator";
import { IoSendOutline } from "react-icons/io5";
import { BeatLoader, ClipLoader } from "react-spinners";
import TypingText from "../components/useTyper";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Translator = () => {
  const detectorRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [requestText, setRequestText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [translatedText, setTranslatedText] = useState(null);
  const [summaryText, setSummaryText] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [detectedLanguageResult, setDetectedLanguageResult] = useState(null);
  const [translatedTextLanguage, setTranslatedTextLanguage] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
  const handleLanguageChange = (selectedLang) => {
    setSelectedLanguage(selectedLang.code);
  };

  const summarizeText = async () => {
    if (!translatedText.trim()) {
      alert("Please enter some translated text to summarize.");
      return;
    }

    setIsDisabled(true);
    setIsSummarizing(true);
    setSummaryText(null);
    try {
      const summarizer = await window.ai.summarizer.create({
        type: "headline",
        format: "markdown",
        length: "medium",
        context: "This summary is for a tech-savvy audience.",
      });

      const result = await summarizer.summarize(translatedText);

      setSummaryText(result);
    } catch (error) {
      console.error("Error summarizing text:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsDisabled(false);
      setIsSummarizing(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to translate.");
      return;
    }

    if (!detectedLanguage?.language) {
      alert("Unable to detect language. Please enter valid text.");
      return;
    }

    setIsTranslating(true);
    setRequestText(inputText);
    setTranslatedText(null);
    setTranslatedTextLanguage(selectedLanguage);
    try {
      const translator = await window.ai.translator.create({
        sourceLanguage: detectedLanguage.language,
        targetLanguage: selectedLanguage,
      });

      const result = await translator.translate(inputText);
      setTranslatedText(result);
      setDetectedLanguageResult(detectedLanguage.language);
    } catch (error) {
      setInputText("");
      toast.error("Check if you're translating English to English!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    async function initializeDetector() {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      if (languageDetectorCapabilities.capabilities === "no") return;

      let newDetector = await self.ai.languageDetector.create();
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
      } else {
        setDetectedLanguage(null);
      }
    };

    const timeoutId = setTimeout(detectLanguage, 500);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setIsDisabled(value.trim() === "");
  };
  const options = [
    { label: "Translator", path: "/ai/translator" },
    { label: "Summarizer", path: "/ai/summarizer" },
  ];
  return (
    <div className="text-white bg-primary max-w-[1200px] pb-[200px] w-full px-8 mx-auto h-full min-h-screen">
      <PageDropDown
        options={options}
        defaultSelected="Translator"
        onSelect={(selectedLang) => handleLanguageChange(selectedLang)}
      />
      {!requestText?.trim() ? (
        <h1 className="py-4 sm:text-[40px] text-[30px] font-poppinsRegular">
          {" "}
          Type what you want to Translate...
        </h1>
      ) : (
        <div className="flex justify-center mt-10">
          <div className="max-w-[500px] w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="pt-2 relative bg-lightPrimary max-w-[500px] w-full rounded-[8px] border border-[#939393]">
                <div className="bg-lightPrimary p-4 text-[13px] max-w-[500px] w-full rounded-[8px]">
                  <p>{requestText}</p>
                </div>
                <div className="py-0.5 absolute top-1 left-1 px-3 rounded-[4px] bg-[#00000063]">
                  <div className="text-[10px] font-poppinsRegular text-white">
                    {detectedLanguageResult === "en"
                      ? "English"
                      : detectedLanguageResult === "pt"
                      ? "Portuguese"
                      : detectedLanguageResult === "es"
                      ? "Spanish"
                      : detectedLanguageResult === "ru"
                      ? "Russian"
                      : detectedLanguageResult === "tr"
                      ? "Turkish"
                      : detectedLanguageResult === "fr"
                      ? "French"
                      : null}
                  </div>
                </div>
              </div>
              <BsArrowDown className="text-[20px]" />
              <div className="pt-2 relative bg-lightPrimary max-w-[500px] w-full rounded-[8px] border border-[#939393]">
                <div className="bg-lightPrimary p-4 text-[13px] max-w-[500px] h-full w-full resize-none outline-none rounded-[8px]">
                  {isSummarizing ? (
                    <div>
                      <BeatLoader color="#fff" size={8} />
                    </div>
                  ) : isTranslating ? (
                    <div>
                      <ClipLoader color="#fff" size={15} />
                    </div>
                  ) : summaryText ? (
                    <TypingText text={summaryText} speed={100} />
                  ) : (
                    <p className="text-[13px]">{translatedText}</p>
                  )}
                </div>

                <div className="py-0.5 px-3 absolute top-1 left-1 rounded-[4px] bg-[#00000063]">
                  <div className="text-[10px] font-poppinsRegular text-white">
                    {translatedTextLanguage === "en"
                      ? "English"
                      : translatedTextLanguage === "pt"
                      ? "Portuguese"
                      : translatedTextLanguage === "es"
                      ? "Spanish"
                      : translatedTextLanguage === "ru"
                      ? "Russian"
                      : translatedTextLanguage === "tr"
                      ? "translatedTextLanguage"
                      : translatedTextLanguage === "fr"
                      ? "French"
                      : null}
                  </div>
                </div>
              </div>
            </div>
            {translatedTextLanguage === "en" ? (
              <div className="flex justify-end">
                <button
                  onClick={summarizeText}
                  disabled={isDisabled || isSummarizing}
                  className={`mt-2 py-2 px-3 text-[10px] rounded-[8px] font-poppinsRegular ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed text-gray-200"
                      : "bg-secondary cursor-pointer text-white"
                  }`}
                >
                  Summarize
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 px-4 -translate-x-1/2 z-50 max-w-[700px] w-full">
        <div className="flex items-center gap-2">
          <AutoDetectIndicator
            languages={languages}
            detectedLanguage={detectedLanguage?.language}
            onSelect={(lang) =>
              setDetectedLanguage({ language: lang.code, confidence: 100 })
            }
            enableAutoDetect
          />
          <BsArrowRight className="text-[38px]" />
          <LanguageSelect
            languages={languages}
            detectedLanguage={selectedLanguage}
            enableAutoDetect={false}
            onSelect={handleLanguageChange}
          />
        </div>
        <div className="px-4 relative pt-4 pb-8 rounded-[10px] bg-lightPrimary max-w-[700px] w-full">
          <textarea
            value={inputText}
            onChange={handleChange}
            rows={3}
            className="bg-lightPrimary text-[13px] max-w-[700px] w-full resize-none outline-none rounded-[8px]"
          />
          <button
            onClick={handleTranslate}
            disabled={isDisabled || isTranslating}
            className={`absolute right-2 bottom-2 py-2 px-3 text-[10px] rounded-[8px] font-poppinsRegular ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-secondary cursor-pointer text-white"
            }`}
          >
            <IoSendOutline />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Translator;

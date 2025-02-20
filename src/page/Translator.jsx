import { useEffect, useRef, useState } from "react";

import LanguageSelect, { PageDropDown } from "../components/DropDown";
import { BsArrowDown, BsArrowRight } from "react-icons/bs";
import AutoDetectIndicator from "../components/AutoDetectIndicator";
const Translator = () => {
  const detectorRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [requestText, setRequestText] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [btnShow, setBtnShow] = useState(true);
  const [translatedText, setTranslatedText] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

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
    setSelectedLanguage(selectedLang);
    console.log("Selected language:", selectedLang);
  };
  console.log(selectedLanguage);
  // const summarizeText = async () => {
  //   if (!inputText.trim()) {
  //     alert("Please enter some text to summarize.");
  //     return;
  //   }
  //   const newRequest = { text: inputText, loading: true };
  //   setRequests((prev) => [...prev, newRequest]);
  //   setInputText("");
  //   setIsDisabled(true);

  //   try {
  //     const summarizer = await window.ai.summarizer.create({
  //       type: "headline",
  //       format: "markdown",
  //       length: "medium",
  //       context: "This summary is for a tech-savvy audience.",
  //     });

  //     const result = await summarizer.summarize(inputText);
  //     setRequests((prev) =>
  //       prev.map((request, index) =>
  //         index === prev.length - 1
  //           ? { ...request, summary: result, loading: false }
  //           : request
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error summarizing text:", error);
  //     alert("Failed to generate summary. Please try again.");
  //     setRequests((prev) =>
  //       prev.map((request, index) =>
  //         index === prev.length - 1 ? { ...request, loading: false } : request
  //       )
  //     );
  //   }
  // };
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to translate.");
      return;
    }

    if (!detectedLanguage?.language) {
      alert("Unable to detect language. Please enter valid text.");
      return;
    }

    console.log("Detected Language:", detectedLanguage.language);
    console.log("Target Language:", selectedLanguage);

    setIsLoading(true);
    setRequestText(inputText);
    setTranslatedText(null);

    try {
      const translator = await window.ai.translator.create({
        sourceLanguage: detectedLanguage.language,
        targetLanguage: selectedLanguage,
      });

      const result = await translator.translate(inputText);
      setTranslatedText(result);
    } catch (error) {
      console.error("Error translating text:", error);
      alert("Failed to translate the text. Please try again.");
    } finally {
      setIsLoading(false);
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
        setBtnShow(topResult.detectedLanguage === "en");
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
    setBtnShow(!detectedLanguage || detectedLanguage.language === "en");
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
      {requestText !== null ? (
        <h1 className="py-4 text-[40px] font-poppinsRegular">{isloading}</h1>
      ) : (
        <div className="flex justify-center mt-10">
          <div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-lightPrimary p-4 text-[13px] max-w-[700px] w-full resize-none outline-none rounded-[8px]">
                <p>{requestText}</p>
              </div>
              <BsArrowDown className="text-[20px]" />

              <div className="bg-lightPrimary p-4 text-[13px] max-w-[700px] h-full w-full resize-none outline-none rounded-[8px]">
                <p>{translatedText}</p>
              </div>
            </div>
            {/* {detectedLanguage?.language === "en" ? (
            <div className="flex justify-end">
              <button
                onClick={summarizeText}
                disabled={
                  isDisabled || requests.some((request) => request.loading)
                }
                className={`mt-2 py-2 px-3 text-[10px] rounded-[8px] font-poppinsRegular ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-secondary cursor-pointer text-white"
                }`}
              >
                Summarize
              </button>
            </div>
          ) : null} */}
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
            enableAutoDetect={false}
            onSelect={(selectedLang) => console.log("Selected:", selectedLang)}
          />
        </div>
        <div className="px-4 relative pt-4 pb-8 rounded-[10px] bg-lightPrimary max-w-[700px] w-full">
          <textarea
            value={inputText}
            onChange={handleChange}
            rows={3}
            className="bg-lightPrimary text-[13px] max-w-[700px] w-full resize-none outline-none rounded-[8px]"
          />

          {btnShow && (
            <button
              onClick={handleTranslate}
              className={`absolute right-2 bottom-2 py-2 px-3 text-[10px] rounded-[8px] font-poppinsRegular ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-secondary cursor-pointer text-white"
              }`}
            >
              Translate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Translator;

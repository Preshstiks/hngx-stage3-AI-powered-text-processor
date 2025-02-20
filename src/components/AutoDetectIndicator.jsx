import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function AutoDetectIndicator({
  languages,
  detectedLanguage,
  enableAutoDetect = false,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    if (detectedLanguage) {
      const detectedLang = languages.find(
        (lang) => lang.code === detectedLanguage
      );
      if (detectedLang) {
        setSelectedLanguage(detectedLang);
        return;
      }
    }

    if (enableAutoDetect) {
      setSelectedLanguage({ code: "auto", name: "Auto-detect" });
    } else {
      setSelectedLanguage(languages.length > 0 ? languages[0] : null);
    }
  }, [detectedLanguage, languages, enableAutoDetect]);

  return (
    <button className="w-full flex text-[12px] cursor-pointer justify-between text-white items-center px-3 py-1 bg-dropDownColor border border-lightPrimary rounded-lg focus:outline-none">
      {selectedLanguage?.name || "Select Language"}
    </button>
  );
}

AutoDetectIndicator.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  detectedLanguage: PropTypes.string,
  enableAutoDetect: PropTypes.bool,
};

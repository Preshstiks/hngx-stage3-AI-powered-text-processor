import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function LanguageSelect({
  languages,
  detectedLanguage,
  onSelect,
  enableAutoDetect = false,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="w-full flex text-[12px] cursor-pointer justify-between text-white items-center px-3 py-1 bg-dropDownColor border border-lightPrimary rounded-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLanguage?.name || "Select Language"}
        {isOpen ? (
          <IoIosArrowUp className="text-[14px]" />
        ) : (
          <IoIosArrowDown className="text-[14px]" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full text-[12px] bg-dropDownColor border border-lightPrimary rounded-lg mt-1 shadow-lg z-50 max-h-[130px] overflow-y-auto">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className="px-3 py-1 hover:bg-lightPrimary cursor-pointer"
              onClick={() => {
                setSelectedLanguage(lang);
                setIsOpen(false);
                onSelect(lang);
              }}
            >
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

LanguageSelect.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  detectedLanguage: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  enableAutoDetect: PropTypes.bool,
};

export const PageDropDown = ({ options, defaultSelected }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(defaultSelected || options[0].label);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    navigate(option.path);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative max-w-48 my-4 w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex text-[12px] w-full cursor-pointer justify-between text-white items-center px-4 py-2 bg-dropDownColor border border-lightPrimary rounded-lg focus:outline-none"
      >
        <span className="font-poppinsRegular">{selected}</span>
        {isOpen ? (
          <IoIosArrowUp className="text-[14px]" />
        ) : (
          <IoIosArrowDown className="text-[14px]" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full text-[12px] bg-dropDownColor border border-lightPrimary rounded-lg mt-1 shadow-lg z-50 max-h-[130px] overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.path}
              className="px-4 py-2 hover:bg-lightPrimary cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

PageDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultSelected: PropTypes.string,
};

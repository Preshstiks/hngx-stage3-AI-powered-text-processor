import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import Summarizer from "./page/Summarizer";
import Translator from "./page/Translator";
import { useState, useEffect } from "react";

function App() {
  const [isSummarizerSupported, setIsSummarizerSupported] = useState(false);
  const [isTranslatorSupported, setIsTranslatorSupported] = useState(false);

  useEffect(() => {
    if ("ai" in self && "summarizer" in self.ai) {
      setIsSummarizerSupported(true);
    }
    if ("ai" in self && "translator" in self.ai) {
      setIsTranslatorSupported(true);
    }
  }, []);

  const OopsPage = (apiname) => (
    <div className="h-screen px-4 flex text-center items-center justify-center">
      <div>
        <h1 className="text-[#8f8f8f] text-[30px] pb-5">Oops!</h1>
        <p className="text-[#8f8f8f] mb-2 font-oxaniumLight">
          It seems like this {apiname} feature is not supported on your device.
        </p>
        <p className="text-[#8f8f8f] font-oxaniumLight">
          Please try again later or contact support.
        </p>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="bg-primary min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/ai/summarizer"
            element={
              isSummarizerSupported ? <Summarizer /> : OopsPage("Summarizer")
            }
          />
          <Route
            path="/ai/translator"
            element={
              isTranslatorSupported ? <Translator /> : OopsPage("Translator")
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

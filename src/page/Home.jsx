import { Cursor, useTypewriter } from "react-simple-typewriter";
import ToolOptionCard from "../components/ToolOptionCard";
import { useNavigate } from "react-router";

const Home = () => {
  const [text] = useTypewriter({
    words: ["TechTrove AI Text Processor.", "the best AI Text Processor."],
    loop: true,
  });
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full px-4 text-white">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="w-full pb-8 sm:h-auto">
          <h1 className="text-center sm:text-[45px] sm:pb-4 pb-2 text-[30px] font-poppinsMedium">
            Welcome to {text} <Cursor />
          </h1>
          <div className="flex justify-center">
            <div className="md:w-[50%] w-[80%] font-poppinsThin">
              <p className="text-center sm:text-[20px]">
                Boost Your writing skills with our summarizer, and translate to
                your desired language.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:gap-6 gap-2">
          <ToolOptionCard
            onClick={() => navigate("/ai/summarizer")}
            type="summarizer"
            title="Summarizer"
            description="Summarizer"
          />
          <ToolOptionCard
            onClick={() => navigate("/ai/translator")}
            type="translator"
            title="Translator"
            description="Convert to different language"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

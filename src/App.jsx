import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import Summarizer from "./page/Summarizer";
import Translator from "./page/Translator";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-primary min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/ai/summarizer" Component={Summarizer} />
            <Route path="/ai/translator" Component={Translator} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

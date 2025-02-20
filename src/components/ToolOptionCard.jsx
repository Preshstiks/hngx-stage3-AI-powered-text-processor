import PropTypes from "prop-types";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoLanguageSharp } from "react-icons/io5";

const ToolOptionCard = ({ type, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="max-w-[350px] cursor-pointer hover:border-secondary sm:active:border-none sm:focus:border-none active:border-secondary w-full shadow-sm shadow-gray-800/50 border p-6 rounded-[10px] border-lightPrimary"
    >
      <div className="h-[50px] w-[50px] rounded-full bg-secondary flex justify-center items-center">
        {type === "summarizer" ? (
          <HiOutlineDocumentText className="text-white text-[30px]" />
        ) : type === "translator" ? (
          <IoLanguageSharp className="text-white text-[30px]" />
        ) : null}
      </div>
      <div className="pt-5">
        <h1 className="sm:text-[20px] text-[18px] font-poppinsRegular pb-2">
          {title}
        </h1>
        <h1 className="sm:text-[14px] text-[12px] font-poppinsThin">
          {description}
        </h1>
      </div>
    </div>
  );
};

ToolOptionCard.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ToolOptionCard;

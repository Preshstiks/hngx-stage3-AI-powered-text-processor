import { HiOutlineUser } from "react-icons/hi";
import Logo from "../assets/img/ailogo-header.png";
import { IoDiamondOutline } from "react-icons/io5";
import { Link } from "react-router";
const Navbar = () => {
  return (
    <div className="bg-primary border-b border-lightPrimary">
      <div className="flex items-center sm:py-0 py-3 justify-between max-w-[1200px] px-4 w-full mx-auto">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              className="sm:h-[70px] sm:w-[70px] w-[50px] h-[50px]"
              alt="logo"
            />
            <h1 className="text-white font-oxaniumMedium uppercase sm:text-[18px]">
              TechTrove AI
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <button className="bg-secondary py-2 sm:py-3 flex items-center gap-2 sm:px-4 px-3 text-[12px] sm:text-[14px] cursor-pointer rounded-[8px] font-poppinsRegular text-white">
            <IoDiamondOutline />
            Premium
          </button>
          <div className="h-9 hidden w-9 flex-none sm:flex items-center justify-center rounded-full cursor-pointer bg-gray-300">
            <HiOutlineUser className="text-gray-400 text-[25px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

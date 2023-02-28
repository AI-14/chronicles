import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { UserProfileMobile } from "./UserProfileMobile";

export const MobileNavbar = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mobNavOnClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="block sm:hidden">
      <div onClick={mobNavOnClick} className="cursor-pointer">
        {!isOpen ? <GiHamburgerMenu size={20} /> : <AiOutlineClose size={20} />}
      </div>
      <div className={`${isOpen ? "fixed top-0 left-0 w-[40%] h-full " : "fixed -left-[1000%]"} bg-white shadow-md shadow-purple-500 transition-all duration-300`}>
        <ul className="flex flex-col space-y-6 text-md items-center">
          <Logo textSize="text-[1.5rem]" animationDelay={3000} />
          <div className="border-[1.2px] border-b-slate-300 w-[80%]"></div>
          {authToken ? (
            <UserProfileMobile setIsOpen={setIsOpen}/>
          ) : (
            <>
              <li className="bg-lightpurple p-2 rounded-full w-20 h-10 hover:bg-darkpurple flex justify-center items-center hover:scale-110 transition-all">
                <Link to="/login">Login</Link>
              </li>
              <li className="border-[1.5px] border-lightpurple p-2 rounded-full w-20 h-10 flex justify-center items-center hover:scale-110 transition-all">
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

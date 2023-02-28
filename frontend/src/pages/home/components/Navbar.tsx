import { Link } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { MobileNavbar } from "./MobileNavbar";
import { Search } from "./Search";
import { UserProfile } from "./UserProfile";

export const Navbar = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");

  return (
    <div className="border-[1.5px] shadow-md shadow-slate-300 h-16 w-full z-10 fixed top-0 left-0 right-0 p-8 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-[1080px] h-full">
        <Logo textSize="text-[1.5rem] sm:text-[2.5rem]" />
        <Search/>
        
        {/** Desktop navbar */}
        <nav className="hidden sm:block">
          <ul className="flex space-x-6 text-md items-center">
            {authToken ? (
              <UserProfile />
            ) : (
              <>
                <li className="bg-lightpurple p-2 rounded-full w-20 h-10 hover:bg-darkpurple flex items-center justify-center hover:scale-110 transition-all">
                  <Link to="/login">Login</Link>
                </li>
                <li className="border-[1.5px] border-lightpurple p-2 rounded-full w-20 h-10 flex items-center justify-center hover:scale-110 transition-all">
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <MobileNavbar />
      </div>
    </div>
  );
};

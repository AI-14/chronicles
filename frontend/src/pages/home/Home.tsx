import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export const Home = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-between h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

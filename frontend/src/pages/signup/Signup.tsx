import { Logo } from "../../components/Logo";
import { SignupForm } from "./components/SignupForm";

export const Signup = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#ece6f2]">
      <div className="flex flex-col items-center rounded-md p-2 w-[80%] sm:w-[40%] bg-white shadow-md shadow-lightpurple">
        <Logo textSize="text-[4rem]" />
        <SignupForm />
      </div>
    </div>
  );
};

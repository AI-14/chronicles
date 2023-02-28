import { useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const Search = (): JSX.Element => {
  const inputRef = useRef<any>();

  const navigate = useNavigate();

  const searchOnClick = () => {
    const title = inputRef.current.value;
    navigate(`/search?title=${title}`);
  };

  return (
    <div className="flex items-center justify-center w-[50%] sm:w-[30%]">
      <input
        type="text"
        placeholder="Search..."
        ref={inputRef}
        className=" border-[1.5px] border-r-0 border-slate-300 rounded-r-none rounded-md text-sm w-full p-2 bg-transparent focus:border-purple-300 focus:outline-none"
      />
      <AiOutlineSearch onClick={searchOnClick} className="w-10 h-[2.45rem] border-[1.5px] border-l-0 border-slate-300 rounded-l-none rounded-md hover:bg-purple-200" />
    </div>
  );
};

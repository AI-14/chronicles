import { useEffect, useRef, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { FaPenNib } from "react-icons/fa";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../../hooks/users/useDeleteUserMutation";
import { useGetUserDataQuery } from "../../../hooks/users/useGetUserDataQuery";
import { cleanUserInfoFromLocalStorage } from "../../../utils/jwtToken";

export const UserProfile = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<any>();

  const navigate = useNavigate();

  const { data: userData } = useGetUserDataQuery(authToken, (_: any) => {
    toast.error("Error in fetching user data. Please try again later.");
  });

  const { mutate: deleteUser } = useDeleteUserMutation(
    (_: any) => {
      toast.success("Account deleted successfully");
      cleanUserInfoFromLocalStorage();
      window.location.reload();
    },
    (_: any) => {
      toast.error("Error in deleting user account. Please try again later.");
    }
  );

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleOptionsOnClick = () => {
    setIsOpen((prev) => !prev);
  };

  const updateCredentialsOnClick = () => {
    navigate("/me/updatecredentials");
  };

  const logoutOnClick = () => {
    cleanUserInfoFromLocalStorage();
    window.location.reload();
  };

  const deleteAccountOnClick = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      deleteUser(authToken);
      navigate("/signup", { replace: true });
    }
  };

  const createBlogOnClick = () => {
    navigate("/blog/create");
  };

  const viewSavedBlogOnClick = () => {
    navigate("/me/readinglist");
  };

  const viewMyBlogsOnClick = () => {
    navigate("/me/blogs");
  };

  return (
    <>
      {/** Write icon */}
      <div onClick={createBlogOnClick} className="flex justify-between items-center gap-x-2 p-2 bg-purple-200 hover:bg-purple-300 hover:cursor-pointer hover:scale-110 transition-all rounded-md">
        <FaPenNib size={14} />
        <p className="text-sm">Write</p>
      </div>

      {/** Saved blogs icon */}
      <div onClick={viewSavedBlogOnClick} className="flex justify-between items-center gap-x-2 p-2 rounded-full cursor-pointer hover:scale-125 transition-all">
        <BsFillBookmarkCheckFill size={14} />
        <p className="text-sm">Saved</p>
      </div>

      {/** My blogs icon */}
      <div onClick={viewMyBlogsOnClick} className="flex justify-between items-center gap-x-2 p-2 rounded-full cursor-pointer hover:scale-125 transition-all">
        <AiTwotoneFolderOpen size={14} />
        <p className="text-sm">Blogs</p>
      </div>

      {/** Profile image & username & dropdown options */}
      <div ref={dropdownRef} onClick={handleOptionsOnClick} className="flex justify-between gap-x-2 items-center p-2 cursor-pointer relative">
        <img src={userData?.profile_image} alt="profileimage" className="w-10 h-10 rounded-full" />
        <p className="font-secondary text-sm over overflow-hidden">@ {userData?.username}</p>
        {isOpen ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} />}
        {isOpen && (
          <div className="w-full absolute left-6 top-16 p-1 bg-white shadow-md z-10 rounded-md text-[0.8rem]">
            <ul className="space-y-1">
              <li onClick={updateCredentialsOnClick} className="hover:bg-blue-300 rounded-md p-2 ">
                Update Credentials
              </li>
              <li onClick={logoutOnClick} className="hover:bg-darkyellow rounded-md p-2">
                Logout
              </li>
              <li onClick={deleteAccountOnClick} className="hover:bg-red-400 rounded-md p-2">
                Delete account
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

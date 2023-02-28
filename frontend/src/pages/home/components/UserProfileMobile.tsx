import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { FaPenNib } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../../hooks/users/useDeleteUserMutation";
import { useGetUserDataQuery } from "../../../hooks/users/useGetUserDataQuery";
import { cleanUserInfoFromLocalStorage } from "../../../utils/jwtToken";
import { UserProfileMobileProps } from "../types";

export const UserProfileMobile = ({ setIsOpen }: UserProfileMobileProps): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
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

  const updateCredentialsOnClick = () => {
    setIsOpen(false);
    navigate("/me/updatecredentials");
  };

  const logoutOnClick = () => {
    setIsOpen(false);
    cleanUserInfoFromLocalStorage();
    window.location.reload();
  };

  const deleteAccountOnClick = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      deleteUser(authToken);
      setIsOpen(false);
      navigate("/signup", { replace: true });
    }
  };

  const createBlogOnClick = () => {
    setIsOpen(false);
    navigate("/blog/create");
  };

  const viewSavedBlogsOnClick = () => {
    setIsOpen(false);
    navigate("/me/readinglist");
  };

  const viewMyBlogsOnClick = () => {
    setIsOpen(false);
    navigate("/me/blogs");
  };

  return (
    <>
      {/** Profile image & username */}
      <div className="flex flex-col justify-between items-center p-2 cursor-pointer hover:scale-110 transition-none">
        <img src={userData?.profile_image} alt="profileimage" className="w-16 h-16 rounded-full" />
        <p className="font-secondary text-sm over overflow-hidden">@ {userData?.username}</p>
      </div>

      {/** Write icon */}
      <div onClick={createBlogOnClick} className="flex justify-between items-center p-2 bg-purple-200 hover:bg-purple-300 hover:cursor-pointer hover:scale-110 transition-all rounded-md w-[50%]">
        <FaPenNib size={14} />
        <p className="text-sm">Write</p>
      </div>

      {/** Saved blogs icon */}
      <div onClick={viewSavedBlogsOnClick} className="flex justify-between items-center p-2 rounded-full cursor-pointer hover:scale-125 transition-all w-[50%]">
        <BsFillBookmarkCheckFill size={14} />
        <p className="text-sm">Saved</p>
      </div>

      {/** My blogs icon */}
      <div onClick={viewMyBlogsOnClick} className="flex justify-between items-center p-2 rounded-full cursor-pointer hover:scale-125 transition-all w-[50%]">
        <AiTwotoneFolderOpen size={14} />
        <p className="text-sm">Blogs</p>
      </div>

      {/** User account util buttons */}
      <div className="flex flex-col p-4 space-y-2 items-center">
        <button onClick={updateCredentialsOnClick} className="text-center bg-blue-200 hover:bg-blue-300 rounded-full text-sm p-2 w-full">
          Update profile
        </button>
        <button onClick={logoutOnClick} className="text-center bg-mediumyellow hover:bg-darkyellow rounded-full text-sm p-2 w-full">
          Logout
        </button>
        <button onClick={deleteAccountOnClick} className="text-center text-red-500 text-sm p-4">
          Delete account
        </button>
      </div>
    </>
  );
};

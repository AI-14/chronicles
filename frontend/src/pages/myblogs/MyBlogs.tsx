import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useGetUserBlogsQuery } from "../../hooks/blogs/useGetUserBlogsQuery";
import { BlogCard } from "./components/BlogCard";

export const MyBlogs = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [selectedOption, setSelectedOption] = useState<string>("publish");

  const {
    data: blogs,
    isError: isErrorFetchBlog,
    isLoading: isLoadingFetchBlog,
  } = useGetUserBlogsQuery(
    selectedOption,
    authToken,
    () => {},
    () => {
      toast.error("Error in fetching your blogs. Try again later.");
    }
  );

  const selectOptionOnClick = () => {
    setSelectedOption(selectedOption === "draft" ? "publish" : "draft");
  };

  if (isErrorFetchBlog) {
    return <ErrorMessage />;
  }

  return (
    <div className="mx-auto max-w-[1080px] mt-20 w-full">
      {isLoadingFetchBlog ? (
        <div className="flex flex-col justify-center items-center">
          <ClipLoader color="#000000" loading={isLoadingFetchBlog} size={25} aria-label="loading-spinner" data-testid="loader" />
        </div>
      ) : (
        <>
          {/** Buttons */}
          <div className="flex justify-center items-center gap-x-6">
            <button
              onClick={selectOptionOnClick}
              className={`${selectedOption === "draft" ? "bg-purple-400" : ""} hover:scale-105 durtion-300 transition-all rounded-md border-[1.5px] border-lightpurple w-[30%]`}
            >
              Draft
            </button>
            <button
              onClick={selectOptionOnClick}
              className={`${selectedOption === "publish" ? "bg-purple-400" : ""} hover:scale-105 durtion-300 transition-all rounded-md border-[1.5px] border-lightpurple w-[30%]`}
            >
              Published
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-y-4 p-2">
            {blogs?.map((blog: any, index: number) => (
              <BlogCard key={index} blogData={blog} status={selectedOption} authToken={authToken} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

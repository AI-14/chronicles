import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";
import { HiFire } from "react-icons/hi";
import { useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useApplaudBlogMutation } from "../../hooks/applauds/useApplaudBlogMutation";
import { useWhetherUserApplaudedQuery } from "../../hooks/applauds/useWhetherUserApplaudedQuery";
import { useGetBlogQuery } from "../../hooks/blogs/useGetBlogQuery";
import { useGetTotalCommentsQuery } from "../../hooks/comments/useGetTotalCommentsQuery";
import { useSaveBlogMutation } from "../../hooks/readinglist/useSaveBlogMutation";
import { useWhetherUserSavedBlogQuery } from "../../hooks/readinglist/useWhetherUserSavedBlogQuery";
import { timeDiff } from "../../utils/relativeTime";
import { Comments } from "./components/Comments";

export const ViewSingleBlog = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [openComments, setOpenComments] = useState<boolean>(false);

  const { blogId } = useParams() as any;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blogData, isError: isErrorFetchBlog, isLoading: isLoadingFetchBlog } = useGetBlogQuery(blogId!, authToken);
  const { data: totalComments } = useGetTotalCommentsQuery(blogId!, authToken);
  const { data: whetherUserApplauded } = useWhetherUserApplaudedQuery(blogId, authToken);
  const { data: whetherUserSavedBlog } = useWhetherUserSavedBlogQuery(blogId, authToken);

  const { mutate: applaudBlog } = useApplaudBlogMutation(
    () => {
      queryClient.invalidateQueries(["get-blog", blogId, authToken]);
      queryClient.invalidateQueries(["whether-user-applauded", blogId, authToken]);
    },
    (_: any) => {
      toast.error("Error in applauding blog. Please try again later.");
    }
  );

  const { mutate: saveBlog } = useSaveBlogMutation(
    () => {
      queryClient.invalidateQueries(["whether-user-saved-blog", blogId, authToken]);
    },
    () => {
      toast.error("Error in saving blog. Please try again later.");
    }
  );

  const editBlogOnClick = () => {
    navigate(`/blog/edit/${blogId}`);
  };

  const applaudBlogOnClick = () => {
    applaudBlog({ blogId, authToken });
  };

  const saveBlogOnClick = () => {
    saveBlog({ blogId, authToken });
  };

  if (isErrorFetchBlog) {
    return <ErrorMessage />;
  }

  const openCommentsModalOnClick = () => {
    setOpenComments(true);
  };

  return (
    <div className="mx-auto max-w-[1080px] mt-20 w-full">
      {isLoadingFetchBlog ? (
        <div className="flex flex-col justify-center items-center">
          <ClipLoader color="#000000" loading={isLoadingFetchBlog} size={25} aria-label="loading-spinner" data-testid="loader" />
        </div>
      ) : (
        <>
          {/** Cover image */}
          <div className="w-full sm:h-[18rem] p-2">
            <img src={blogData?.cover_image} alt="coverimage" className=" w-full h-[10rem] sm:h-full rounded-md object-cover" />
          </div>

          <div className="flex justify-center p-2 items-center">
            {/** Author info & date */}
            <div className="flex justify-center items-center pl-2">
              <img src={blogData?.["author_profile_image"]} alt="author-profileimage" className="w-7 h-7 sm:w-10 sm:h-10 rounded-full" />
              <p className=" text-sm p-2">@ {blogData?.["author_username"] + " • "}</p>
              <p className="text-center text-[0.5rem] sm:text-[0.8rem]">{timeDiff(new Date(blogData.created_at).valueOf())}</p>
            </div>

            {/** Like/Bookmark/Comment buttons */}
            <div className="p-4 flex justify-end gap-x-2">
              <div onClick={applaudBlogOnClick} className="flex flex-col justify-between items-center p-2 cursor-pointer hover:scale-110 duration-300">
                <HiFire size={18} color={`${whetherUserApplauded?.message === "true" ? "#c095e8" : ""}`} />
                <p className="text-[0.62rem]">{Intl.NumberFormat("en", { notation: "compact" }).format(blogData?.applaud_count)}</p>
              </div>
              <div onClick={openCommentsModalOnClick} className="flex flex-col justify-between items-center p-2 cursor-pointer hover:scale-110 duration-300">
                <FaComments />
                <p className="text-[0.62rem]">{totalComments?.total}</p>
              </div>
              <div onClick={saveBlogOnClick} className="flex flex-col justify-between items-center p-2 cursor-pointer hover:scale-110 duration-300">
                <BsFillBookmarkCheckFill color={`${whetherUserSavedBlog?.message === "true" ? "#c095e8" : ""}`} />
              </div>
            </div>
          </div>

          {/** Edit button in case of blogs belonging to the current online user */}
          {blogData?.author === userId ? (
            <div className="flex justify-center items-center">
              <AiFillEdit onClick={editBlogOnClick} className="hover:scale-110 duration-300 cursor-pointer w-8 h-8 bg-yellow-300 rounded-full p-1" />
            </div>
          ) : null}

          {/** Title & subtitle */}
          <h2 className="mt-4 p-2 font-bold text-sm text-center sm:text-lg break-words">{blogData?.title}</h2>
          <p className="p-2 text-[0.55rem] sm:text-[0.75rem] text-center break-words">{blogData?.subtitle}</p>

          {/** Content */}
          <div className="w-full p-2">
            <ReactQuill value={blogData?.content} readOnly preserveWhitespace modules={{ toolbar: false }} />
          </div>

          {/** Comments Modal */}
          {openComments && <Comments blogId={blogId} authToken={authToken} setOpenComments={setOpenComments} />}
        </>
      )}
    </div>
  );
};

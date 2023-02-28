import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useDeleteCommentMutation } from "../../../hooks/comments/useDeleteCommentMutation";
import { useGetAllCommentsQuery } from "../../../hooks/comments/useGetAllCommentsQuery";
import { usePostCommentMutation } from "../../../hooks/comments/usePostCommentMutation";
import { CommentsProps } from "../types";

export const Comments = ({ blogId, authToken, setOpenComments }: CommentsProps): JSX.Element => {
  const userId = localStorage.getItem("userId");
  const [commentContent, setCommentContent] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: allComments } = useGetAllCommentsQuery(
    blogId,
    authToken,
    (_: any) => {},
    (_: any) => {
      toast.error("Error in fetching comments. Try again later.");
    }
  );

  const { mutate: postComment } = usePostCommentMutation(
    (_: any) => {
      queryClient.invalidateQueries(["get-all-comments", blogId, authToken]);
      queryClient.invalidateQueries(["get-total-comments", blogId, authToken]);
    },
    (_: any) => {
      toast.error("Error in posting comment. Try again later.");
    }
  );

  const { mutate: deleteComment } = useDeleteCommentMutation(
    () => {
      queryClient.invalidateQueries(["get-all-comments", blogId, authToken]);
      queryClient.invalidateQueries(["get-total-comments", blogId, authToken]);
    },
    () => {
      toast.error("Error in deleting comment. Try again later.");
    }
  );
  const commentOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCommentContent(e.target.value);
  };

  const postCommentOnClick = (): void => {
    if (commentContent.length === 0) {
      toast.error("Empty comment!");
      return;
    }

    let data = JSON.stringify(commentContent);
    postComment({ blogId, authToken, data });
  };

  const handleDeleteCommentOnClick = (commentId: string): void => {
    deleteComment({ blogId, authToken, commentId });
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 h-screen w-screen bg-gray-100 bg-opacity-80 flex justify-center items-center mt-8">
      {/** Modal container */}
      <div className="text-black flex flex-col items-center border-[1.5px] rounded-xl shadow-md shadow-slate-200 bg-white w-[80%] h-[80%] sm:w-[50%]">
        {/** Header */}
        <div className="flex justify-center items-center w-full p-2 relative">
          <h2 className="font-bold">Comments</h2>
          <RxCrossCircled onClick={() => setOpenComments(false)} color="red" className="absolute right-2 cursor-pointer" />
        </div>

        {/** Comment input & button */}
        <div className="p-4 w-full flex justify-between items-center gap-x-2">
          <input
            type="text"
            placeholder="Write your comment here..."
            onChange={commentOnChange}
            className="border-[1.5px] border-slate-300 rounded-md text-sm w-full p-2 bg-transparent focus:border-purple-300 focus:outline-none"
          />
          <button onClick={postCommentOnClick} className="text-sm border-[1.2px] bg-slate-200 rounded-md p-1 hover:scale-110 duration-300 transition-all">
            Post
          </button>
        </div>

        {/** Comment card */}
        {allComments?.map((comment: any, index: number) => (
          <div key={index} className="w-full flex flex-col items-start border-b-[1px] border-b-slate-200">
            <div className="flex justify-start items-center pl-4 pr-4">
              <img src={comment?.["user_profile_image"]} alt="author-profileimage" className="w-4 h-4 sm:w-6 sm:h-6 rounded-full" />
              <p className=" text-[0.6rem] p-2">@ {comment?.["user_username"] + " •"}</p>
              <p className="text-center text-[0.5rem] sm:text-[0.6rem]">{new Date(comment?.created_at).toDateString()}</p>
              {userId === comment.user && (
                <AiFillDelete onClick={() => handleDeleteCommentOnClick(comment?.id)} className="ml-4 hover:scale-110 duration-300 cursor-pointer w-6 h-6 hover:bg-red-400 rounded-full p-1" />
              )}
            </div>
            <p className="text-[0.6rem] pl-4 pr-4 w-full break-words whitespace-normal">{comment?.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDeleteBlogQuery } from "../../../hooks/blogs/useDeleteBlogMutation";
import { timeDiff } from "../../../utils/relativeTime";
import { BlogCardProps } from "../types";

export const BlogCard = ({ blogData, status, authToken }: BlogCardProps): JSX.Element => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteBlog } = useDeleteBlogQuery(() => {
    queryClient.invalidateQueries(["get-user-blogs", status]);
  });

  const viewBlogOnClick = () => {
    if (blogData.status === "publish") {
      navigate(`/blog/view/${blogData.id}/${blogData.slug}/`);
    }
  };

  const editBlogOnClick = () => {
    navigate(`/blog/edit/${blogData.id}/`);
  };

  const deleteBlogOnClick = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      let blogId: string = blogData.id;
      deleteBlog({ blogId, authToken });
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-2 p-1 rounded-md border-[1.5px] border-slate-200 shadow-md shadow-slate-300 w-full sm:w-1/2">
      <h2 onClick={viewBlogOnClick} className="p-2 font-bold text-sm sm:text-lg sm:whitespace-nowrap sm:overflow-hidden sm:overflow-ellipsis cursor-pointer w-full">
        {blogData.title}
      </h2>

      <div className="flex justify-between items-center p-2">
        <p className="p-2 text-[0.6rem] sm:text-[0.7rem]">{timeDiff(new Date(blogData.created_at).valueOf())}</p>

        <div className="flex justify-between items-center gap-x-2 p-2">
          <AiFillEdit onClick={editBlogOnClick} className="hover:scale-110 duration-300 cursor-pointer w-8 h-8 bg-yellow-300 rounded-full p-1" />
          <AiFillDelete onClick={deleteBlogOnClick} className="hover:scale-110 duration-300 cursor-pointer w-8 h-8 hover:bg-red-400 rounded-full p-1" />
        </div>
      </div>
    </div>
  );
};

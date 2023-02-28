import { ClipLoader } from "react-spinners";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useGetSavedBlogsQuery } from "../../hooks/readinglist/useGetSavedBlogsQuery";
import { BlogCard } from "./components/BlogCard";

export const ReadingList = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const { data: savedBlogs, isError: isErrorFetchSavedBlogs, isLoading: isLoadingFetchSavedBlogs } = useGetSavedBlogsQuery(authToken);

  if (isErrorFetchSavedBlogs) {
    return <ErrorMessage />;
  }

  return (
    <div className="mx-auto max-w-[1080px] mt-20">
      <div className="grid grid-cols-2 content-center gap-4 p-2 w-full">
        {isLoadingFetchSavedBlogs ? (
          <div className="flex flex-col justify-center items-center">
            <ClipLoader color="#000000" loading={isLoadingFetchSavedBlogs} size={25} aria-label="loading-spinner" data-testid="loader" />
          </div>
        ) : (
          <>
            {savedBlogs?.map((blog: any, index: number) => (
              <BlogCard blogData={blog} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

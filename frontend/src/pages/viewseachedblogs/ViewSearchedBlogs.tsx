import React from "react";
import { useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useSearchBlogQuery } from "../../hooks/blogs/useSearchBlogQuery";
import { BlogCard } from "./components/BlogCard";

export const ViewSearchedBlogs = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [searchParam, _] = useSearchParams();
  const { data: blogs, isError, isLoading } = useSearchBlogQuery(searchParam.get("title")!, authToken);

  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <div className="mx-auto max-w-[1080px] mt-20 w-full">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center">
          <ClipLoader color="#000000" loading={isLoading} size={25} aria-label="loading-spinner" data-testid="loader" />
        </div>
      ) : (
        blogs?.map((blogData: any, index: number) => (
          <div key={index} className="flex flex-col items-center">
            <BlogCard blogData={blogData} />
          </div>
        ))
      )}
    </div>
  );
};

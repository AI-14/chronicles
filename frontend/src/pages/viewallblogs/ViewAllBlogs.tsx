import { useState } from "react";
import ReactPaginate from "react-paginate";
import { ClipLoader } from "react-spinners";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useGetAllBlogsQuery } from "../../hooks/blogs/useGetAllBlogsQuery";
import { BlogCard } from "./components/BlogCard";
import { CategorySelection } from "./components/CategorySelection";

export const ViewAllBlogs = (): JSX.Element => {
  const [catIndex, setCatIndex] = useState<any>({
    index: 0,
    cat: "all",
  });

  const [page, setPage] = useState<number>(1);

  const { data: blogs, isError: isErrorFetchBlog, isLoading: isLoadingFetchBlog } = useGetAllBlogsQuery(catIndex.cat, page);

  const pageChangeOnChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  if (isErrorFetchBlog) {
    return <ErrorMessage />;
  }

  return (
    <div className="mx-auto max-w-[1080px] mt-20">
      <CategorySelection catIndex={catIndex} setCatIndex={setCatIndex} />

      {isLoadingFetchBlog ? (
        <div className="flex flex-col justify-center items-center">
          <ClipLoader color="#000000" loading={isLoadingFetchBlog} size={25} aria-label="loading-spinner" data-testid="loader" />
        </div>
      ) : (
        blogs?.results?.result?.map((blogData: any, index: number) => (
          <div key={index} className="flex flex-col items-center">
            <BlogCard blogData={blogData} />
          </div>
        ))
      )}

      <div className="mt-8 p-2">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={blogs?.results["total_pages"]}
          marginPagesDisplayed={4}
          pageRangeDisplayed={6}
          onPageChange={pageChangeOnChange}
          containerClassName={"rounded-md flex justify-center gap-2"}
          pageClassName={"border-[0.8px] border-slate-300 text-purple-400 font-bold w-[1.5rem] h-[1.5rem] text-center rounded-md hover:bg-purple-200"}
          previousClassName={"text-purple-500 font-bold w-[1.5rem] h-[1.5rem] text-center rounded-md border-[0.8px] border-slate-300 hover:bg-purple-200"}
          nextClassName={"text-purple-500 font-bold w-[1.5rem] h-[1.5rem] text-center rounded-md border-[0.8px] border-slate-300 hover:bg-purple-200"}
          breakClassName={"text-purple-500"}
          activeClassName={"bg-purple-200"}
        />
      </div>
    </div>
  );
};

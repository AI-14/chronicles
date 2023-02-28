import { useQuery } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useGetAllBlogsQuery = (category: string, page: number) => {
  return useQuery(["get-all-blogs", category, page], () => BlogServicesAPI.getAllBlogs(category, page), {
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });
};

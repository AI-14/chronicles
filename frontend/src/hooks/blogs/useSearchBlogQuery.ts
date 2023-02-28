import { useQuery } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useSearchBlogQuery = (title: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["search-blog", title], () => BlogServicesAPI.searchBlog(title, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};

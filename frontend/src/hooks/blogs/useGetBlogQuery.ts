import { useQuery } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useGetBlogQuery = (blogId: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["get-blog", blogId, authToken], () => BlogServicesAPI.getBlog(blogId, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};

import { useQuery } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useGetUserBlogsQuery = (status: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["get-user-blogs", status], () => BlogServicesAPI.getUserBlogs(status, authToken), {
    onSuccess: onSuccess,
    onError: onError,
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
  });
};

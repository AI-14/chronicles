import { useQuery } from "react-query";
import { ReadinglistServicesAPI } from "../../services/readinglistServices";

export const useGetSavedBlogsQuery = (authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["get-saved-blogs", authToken], () => ReadinglistServicesAPI.getSavedBlogs(authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};

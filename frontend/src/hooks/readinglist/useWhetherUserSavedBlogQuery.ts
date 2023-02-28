import { useQuery } from "react-query";
import { ReadinglistServicesAPI } from "../../services/readinglistServices";

export const useWhetherUserSavedBlogQuery = (blogId: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["whether-user-saved-blog", blogId, authToken], () => ReadinglistServicesAPI.whetherUserSavedBlog(blogId, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};

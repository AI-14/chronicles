import { useMutation } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const usePostBlogMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("post-blog", BlogServicesAPI.postBlog, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

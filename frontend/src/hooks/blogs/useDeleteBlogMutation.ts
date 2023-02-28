import { useMutation } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useDeleteBlogQuery = (onSuccess?: any, onError?: any) => {
  return useMutation("delete-blog", BlogServicesAPI.deleteBlog, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

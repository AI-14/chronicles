import { useMutation } from "react-query";
import { BlogServicesAPI } from "../../services/blogServices";

export const useEditBlogMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("edit-blog", BlogServicesAPI.editBlog, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

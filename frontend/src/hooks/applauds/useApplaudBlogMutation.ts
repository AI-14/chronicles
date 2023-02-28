import { useMutation } from "react-query";
import { ApplaudServicesAPI } from "../../services/applaudServices";

export const useApplaudBlogMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("applaud-blog", ApplaudServicesAPI.applaudBlog, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

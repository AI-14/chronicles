import { useMutation } from "react-query";
import { ReadinglistServicesAPI } from "../../services/readinglistServices";

export const useSaveBlogMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("applaud-blog", ReadinglistServicesAPI.saveBlog, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

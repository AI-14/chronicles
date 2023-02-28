import { useMutation } from "react-query";
import { CommentServicesAPI } from "../../services/commentServices";

export const usePostCommentMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("post-comment", CommentServicesAPI.addComment, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

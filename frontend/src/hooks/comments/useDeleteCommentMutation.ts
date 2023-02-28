import { useMutation } from "react-query";
import { CommentServicesAPI } from "../../services/commentServices";

export const useDeleteCommentMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("delete-comment", CommentServicesAPI.deleteComment, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

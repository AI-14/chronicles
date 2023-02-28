import { useMutation } from "react-query";
import { UserServiceAPI } from "../../services/userServices";

export const useLoginUserMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("login-user", UserServiceAPI.login, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

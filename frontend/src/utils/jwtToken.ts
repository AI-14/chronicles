import jwtDecode from "jwt-decode";

export const setUserInfoInLocalStorage = (token: string): void => {
  let decodedAuthToken: any = jwtDecode(token);
  localStorage.setItem("userId", decodedAuthToken.user_id);
  localStorage.setItem("username", decodedAuthToken.username);
  localStorage.setItem("email", decodedAuthToken.email);
  localStorage.setItem("authToken", token);
};

export const cleanUserInfoFromLocalStorage = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("authToken");
};

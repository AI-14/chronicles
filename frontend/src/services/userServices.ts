import { api } from "./apiConfig";
import { UpdateCreds } from "./types";

class UserServiceAPI {
  static signup = async (data: FormData) => {
    const response = await api.post("users/user/signup/", data, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });

    return response.data;
  };

  static login = async (data: string) => {
    const response = await api.post("users/user/login/token/", data, {
      headers: {
        "Content-type": "application/json",
      },
    });

    return response.data;
  };

  static getUserInfo = async (authToken: string | null) => {
    const response = await api.get("users/user/", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static updateCreds = async ({ data, authToken }: UpdateCreds) => {
    const response = await api.put("users/user/", data, {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static deleteUser = async (authToken: string | null) => {
    const response = await api.delete("users/user/", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };
}

export { UserServiceAPI };

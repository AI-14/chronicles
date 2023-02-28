import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import validator from "validator";
import { InputField } from "../../components/InputField";
import { useUpdateCredsMutation } from "../../hooks/users/useUpdateCredsMutation";
import { cleanUserInfoFromLocalStorage } from "../../utils/jwtToken";
import { SelectImage } from "./components/SelectImage";
import { FormInfo } from "./types";

export const UpdateCredentials = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormInfo>({
    email: "",
    password: "",
    profileImageFile: null,
  });

  const navigate = useNavigate();

  const { mutate: updateCreds } = useUpdateCredsMutation(
    (_: any) => {
      setIsLoading(false);
      cleanUserInfoFromLocalStorage();
      navigate("/login", { replace: true });
    },
    (error: any) => {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      } else {
        toast.error("Error in updating profile. Please try again later.");
      }
    }
  );

  useEffect(() => {
    if (formData.profileImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfileImage(reader.result as string);
      };
      reader.readAsDataURL(formData.profileImageFile);
    } else {
      setPreviewProfileImage(null);
    }
  }, [formData.profileImageFile]);

  const setImageOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files;
    if (file) {
      setFormData({ ...formData, profileImageFile: file[0] });
    } else {
      setFormData({ ...formData, profileImageFile: null });
    }
  };

  const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, email: e.target.value });
  };

  const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, password: e.target.value });
  };

  const updateCredsOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(formData);
    if (formData.email.length === 0 && formData.password.length === 0 && formData.profileImageFile === null) {
      toast.error("Empty fields!");
    } else {
      setIsLoading(true);

      const data = new FormData();
      if (formData.email.length !== 0) {
        if (formData.email.length > 0 && formData.email.length <= 20 && validator.isEmail(formData.email)) {
          data.append("email", formData.email);
        } else {
          toast.error("Invalid email");
          setIsLoading(false);
          return;
        }
      }

      if (formData.password.length !== 0) {
        if (formData.password.length >= 6 && formData.password.length <= 12) {
          data.append("password", formData.password);
        } else {
          toast.error("Password must be in between 6-12 characters");
          setIsLoading(false);
          return;
        }
      }

      if (formData.profileImageFile !== null) {
        data.append("profile_image", formData.profileImageFile!);
      }

      updateCreds({ data, authToken });
    }
  };

  return (
    <div className="mx-auto max-w-[1080px] mt-24 flex justify-center items-center w-full">
      <form onSubmit={updateCredsOnSubmit} className="w-1/2 flex flex-col items-center">
        <SelectImage previewImage={previewProfileImage} onChangeHandler={setImageOnChange} />
        <InputField label="New email" type="text" name="email" placeholder="Enter new email" onChangeHandler={emailOnChange} />
        <InputField label="New password" type="password" name="password" placeholder="Enter new password" onChangeHandler={passwordOnChange} />

        <button type="submit" className="w-1/2 h-10 mt-4 rounded-full bg-lightpurple hover:bg-darkpurple font-extrabold">
          {isLoading ? <ClipLoader color="#000000" loading={isLoading} size={15} aria-label="loading-spinner" data-testid="loader" /> : "Update"}
        </button>
      </form>
    </div>
  );
};

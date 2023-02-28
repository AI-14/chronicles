export interface FormInfo {
  email: string;
  password: string;
  profileImageFile: File | null;
}

export interface SelecImageProps {
  previewImage: string | null;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}

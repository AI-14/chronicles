export interface SelectCoverImageProps {
  previewImage: string | null;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}

export interface BlogFormData {
  title: string;
  subtitle: string;
  coverImage: File | null;
  category: string;
  content: string;
}
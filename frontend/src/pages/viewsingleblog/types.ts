export interface CommentsProps {
  blogId: string;
  authToken: string | null;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
}

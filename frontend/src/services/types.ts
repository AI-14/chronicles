export interface UpdateCreds {
  data: FormData;
  authToken: string | null;
}

interface BaseBlog {
  blogId: string;
  authToken: string | null;
}

export interface PostBlog {
  data: FormData;
  authToken: string | null;
}

export interface EditBlog {
  blogId: string;
  data: FormData;
  authToken: string | null;
}

export interface ApplaudBlog extends BaseBlog {}

export interface DeleteBlog extends BaseBlog {}

export interface SaveBlog extends BaseBlog {}

export interface AddComment {
  blogId: string;
  authToken: string | null;
  data: string;
}

export interface DeleteComment extends BaseBlog {
  commentId: string;
}

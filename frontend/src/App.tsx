import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CreateBlog } from "./pages/createblog/CreateBlog";
import { EditBlog } from "./pages/editblog/EditBlog";
import { Error404NotFound } from "./pages/Error404NotFound";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import { MyBlogs } from "./pages/myblogs/MyBlogs";
import { ReadingList } from "./pages/readinglist/ReadingList";
import { Signup } from "./pages/signup/Signup";
import { UpdateCredentials } from "./pages/updatecreds/UpdateCredentials";
import { ViewAllBlogs } from "./pages/viewallblogs/ViewAllBlogs";
import { ViewSearchedBlogs } from "./pages/viewseachedblogs/ViewSearchedBlogs";
import { ViewSingleBlog } from "./pages/viewsingleblog/ViewSingleBlog";

const queryClient = new QueryClient();

export const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} autoClose={1500} style={{ fontSize: "0.7rem" }} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Home />}>
          <Route path="/" element={<ViewAllBlogs />} />

          {/** Protecting all other routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/blog/view/:blogId/:blogSlug" element={<ViewSingleBlog />} />
            <Route path="/blog/create" element={<CreateBlog />} />
            <Route path="/blog/edit/:blogId/" element={<EditBlog />} />
            <Route path="/search" element={<ViewSearchedBlogs />} />
            <Route path="/me/blogs" element={<MyBlogs />} />
            <Route path="/me/readinglist" element={<ReadingList />} />
            <Route path="/me/updatecredentials" element={<UpdateCredentials />} />
          </Route>
        </Route>

        <Route path="*" element={<Error404NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
};

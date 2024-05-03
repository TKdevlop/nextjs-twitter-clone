import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import CustomCard from "./components/CustomCard";
import axios from "axios";
import { GetServerSideProps } from "next";
import InfiniteScroll from "react-infinite-scroller";

export type Post = {
  user: string;
  content: string;
  date: string;
  isLikedBy: string[];
  likeCount: number;
  comments: { by: string; content: string }[];
};

interface IProps {}
const postsData = [
  {
    user: "string",
    content: "string",
    date: "string",
    likeCount: 0,
    isLikedBy: ["tester"],
    comments: [],
  },
];
const currentUser = "string";

// export const getServerSideProps = (async () => {
//   // Fetch data from external API
//   const res = await import("./api/posts/get");
//   const posts: Post[] = await (await res.handler()).json();
//   // Pass data to the page via props
//   return { props: { posts: posts } };
// }) satisfies GetServerSideProps<{ posts: Post[] }>;

const Posts: React.FC<IProps> = (props) => {
  console.log(props);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  const [modelState, setModalState] = React.useState("add");
  const [currentSelectedPost, setCurrentSelectedPost] = React.useState<
    Post | undefined
  >();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postsCount, setPostsCount] = React.useState(0);
  const [postText, setPostText] = React.useState("");
  const [commentText, setCommentText] = React.useState("");
  const { data: session, status } = useSession();
  const handleClickOpen = () => {
    setPostText("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fetchPosts = async () => {
    setLoading(true);
    const res = await axios.get(`/api/posts/get?skip=${posts.length}&limit=5`);
    setPosts([...posts, ...res.data.posts]);
    setPostsCount(res.data.totalCount);
    setLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  //session not working due to nextjs cred issues
  // if (status !== "authenticated") {
  //   return <a href="/api/auth/signin">Sign in</a>;
  // }
  const handleAddPost = async () => {
    const post = await axios.post<Post>("/api/posts/create", {
      user: currentUser,
      content: postText,
      date: new Date(),
      likeCount: 0,
      isLikedBy: [],
      comments: [],
    });
    setModalState("add");
    setPosts([post.data, ...posts]);
    setOpen(false);
  };
  const handleEditPost = async () => {
    const updatedPost = await axios.patch<Post>(
      `/api/posts/edit/${currentSelectedPost._id}`,
      {
        user: currentUser,
        content: postText,
      }
    );
    const updatedPosts = posts.map((post) => {
      if (post._id === updatedPost.data._id) return updatedPost.data;
      return post;
    });
    setPosts(updatedPosts);
    setOpen(false);
  };
  const handleAddComment = async () => {
    const updatedPost = await axios.patch<Post>(
      `/api/posts/edit/${currentSelectedPost._id}`,
      {
        comments: [
          ...currentSelectedPost?.comments,
          { by: currentUser, content: commentText },
        ],
      }
    );
    const updatedPosts = posts.map((post) => {
      if (post._id === updatedPost.data._id) return updatedPost.data;
      return post;
    });
    setCurrentSelectedPost(updatedPost.data);
    setPosts(updatedPosts);
    setCommentText("");
  };
  const handleLikePost = async (post) => {
    const updatedPost = await axios.patch<Post>(`/api/posts/like/${post._id}`, {
      user: currentUser,
    });
    const updatedPosts = posts.map((post) => {
      if (post._id === updatedPost.data._id) return updatedPost.data;
      return post;
    });
    setPosts(updatedPosts);
  };
  const editModalOpen = async (post: Post) => {
    setModalState("edit");
    setPostText(post.content || "");
    setCurrentSelectedPost(post);
    setOpen(true);
  };
  const openChatPostModel = (post: Post) => {
    setCurrentSelectedPost(post);
    setCommentModal(true);
  };

  return (
    <Container>
      <Fab
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              sx={{ mt: 3 }}
              id="outlined-multiline-static"
              label="Post Content"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              multiline
              fullWidth
              rows={4}
              placeholder="Start typing post content.."
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={modelState === "add" ? handleAddPost : handleEditPost}
            disabled={postText.trim() === ""}
            autoFocus
          >
            post
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={commentModal}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Comments</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 3, mb: 2 }}
            id="outlined-multiline-static"
            label="Post Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            multiline
            fullWidth
            rows={4}
            placeholder="Start typing post comment.."
          />
          <DialogContentText id="alert-dialog-description">
            {currentSelectedPost?.comments.map((comment, i) => (
              <Typography key={i}>
                {<b>{comment.by}</b>} - {comment.content};
              </Typography>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentModal(false)}>Close</Button>
          <Button
            onClick={handleAddComment}
            disabled={commentText.trim() === ""}
            autoFocus
          >
            Add comment
          </Button>
        </DialogActions>
      </Dialog>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchPosts}
        hasMore={posts.length !== postsCount}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {posts.map((post) => (
          <CustomCard
            openChatPostModel={openChatPostModel}
            handleLikePost={handleLikePost}
            openEditPostModel={editModalOpen}
            key={post.user}
            currentUser={currentUser}
            post={post}
          />
        ))}
      </InfiniteScroll>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size={100} />
        </Box>
      )}
    </Container>
  );
};
export default Posts;

import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { Post } from "../pages/posts";

interface Props {
  post: Post;
  openEditPostModel: (post: Post) => void;
  openChatPostModel: (post: Post) => void;
  currentUser: string;
  handleLikePost: (post: Post) => void;
}
export default function CustomCard({
  currentUser,
  post,
  openEditPostModel,
  openChatPostModel,
  handleLikePost,
}: Props) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.user.at(0)}
          </Avatar>
        }
        title={post.user}
        subheader={post.date}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={() => handleLikePost(post)}
          aria-label="add to favorites"
        >
          <FavoriteIcon
            color={post.isLikedBy.includes(currentUser) ? "primary" : "inherit"}
          />{" "}
          {post.likeCount}
        </IconButton>
        {currentUser === post.user && (
          <IconButton onClick={() => openEditPostModel(post)} aria-label="edit">
            <EditIcon />
          </IconButton>
        )}
        <IconButton onClick={() => openChatPostModel(post)} aria-label="chat">
          <ChatIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

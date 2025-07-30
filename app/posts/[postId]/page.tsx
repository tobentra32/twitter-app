"use client"
import { useRouter, useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

import usePost from "../../hooks/usePost";

import Header from "../../components/Header";
import Form from "../../components/Form";
import PostItem from "../../components/posts/PostItem";
import CommentFeed from "../../components/posts/CommentFeed";


const PostView = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId;
  console.log("post ID from params:", postId);
  //const { postId } = router.query;

  const { data: fetchedPost, isLoading } = usePost(postId as string);

  if (isLoading || !fetchedPost) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={60} />
      </div>
    )
  }

  return ( 
    <>
      <Header showBackArrow label="Tweet" />
      <PostItem data={fetchedPost} />
      <Form postId={postId as string} isComment placeholder="Tweet your reply" />
      <CommentFeed comments={fetchedPost?.comments} />
    </>
   );
}
 
export default PostView;
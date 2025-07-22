"use client"
import Header from "./components/Header";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import EditModal from "./components/modals/EditModal";
import Form from "./components/Form";
import PostFeed from "./components/posts/PostFeeds";


export default function Home() {
  return (
    <>

      <EditModal />
      <LoginModal />
      <RegisterModal />
      <Header label="Home" />
      <Form placeholder="What's happening?" />
      <PostFeed />

    </>
  );
}

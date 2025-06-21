"use client";

import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import useUser from "../../hooks/useUser";
import UserHero from "../../components/users/UserHero";
import UserBio from "../../components/users/UserBio";
import Header from "../../components/Header";

const UserView = () => {
  // Use useParams to get the userId from the URL
  const params = useParams();
  const userId = params.userId;
  console.log("User ID from params:", userId);

  const { data: fetchedUser, isLoading } = useUser(userId as string);
  console.log("Fetched user:", fetchedUser);


  if (isLoading ) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={60} />
      </div>
    );
  }

  
  return (
    <>
      <Header showBackArrow label={fetchedUser.name} />
      <UserHero userId={userId as string} />
      <UserBio userId={userId as string} />
    </>
  );
};

export default UserView;

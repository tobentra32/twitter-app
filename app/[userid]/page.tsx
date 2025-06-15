import { useRouter,useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import useUser from "../hooks/useUser";

import Header from "../components/Header";



const UserView = () => {



    const router = useRouter();

    const params = useParams();
  const userId = params.userId;



    const { data: fetchedUser, isLoading } = useUser(userId as string);

    if (isLoading || !fetchedUser) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader color="lightblue" size={80} />
            </div>
        )
    }

    return (
        <>
            <Header showBackArrow label={fetchedUser?.name} />

        </>
    );
}

export default UserView;
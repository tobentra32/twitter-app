"use client"
import  useSWR  from 'swr'; // Correct import for SWR v2 and above
import fetcher from "../libs/fetcher";

const useCurrentUser = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    };
};

export default useCurrentUser;

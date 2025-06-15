"use client"

import { useRouter } from "next/navigation";
import {useCallback} from "react"
import {BiArrowBack} from "react-icons/bi"

interface HeaderProps {
    label: String;
    showBackArrow?: boolean;

}

const Header = ({label,showBackArrow}:HeaderProps) => {

    const router = useRouter();
    
    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (

        <div className="border-p-[1px] border-neutral-800 p-5">

            <div className="flex flex-row items-center gap-2">
                {
                    showBackArrow && (
                        <BiArrowBack 
                          onClick={handleBack}
                          color="white"
                          size={20}
                          className="
                            cursor-pointer
                            hover:opacity-70
                            transition
                          
                            "
                         />
                       


                        
                    )
                }

                <h2 className="text-white text-xl font-semibold">{label}</h2>



            </div>
            


            
        </div>

    );
}

export default Header;

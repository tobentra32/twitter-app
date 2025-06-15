import { useCallback, useState } from "react";
import useLoginModal from "../../hooks/useLoginModal";
import Input from "../Input";
import useRegisterModal from "../../hooks/useRegisterModal";
import Modal,{ ModalProps } from "../Modal";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const onToggle = useCallback(() => {
        if (isLoading) {
            return ;
        }

        registerModal.onClose();
        loginModal.onOpen();

    },[isLoading, registerModal, loginModal]);

    const router = useRouter();

    
    const onSubmit = useCallback(async () => {

        console.log('subitting');

        try {
            setIsLoading(true);

            const res = await axios.post('/api/register', {
                email,
                password,
                username,
                name
            });
            toast.success('Account created.');
            if (res.status === 200) {
                router.push('/');
                
            }
            
            signIn('credentials', {
                email,
                password
            });

            registerModal.onClose();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }

    },[loginModal, email, password, username, name]);

    const bodyContent = (
        <div className="flex flex-col gap-2">
            <Input
               placeholder="Email"
               type="email"
               onChange={(e)=> setEmail(e.target.value)}
               value= {email}
               disabled={isLoading}
            />
            <Input
               placeholder="Name"
               onChange={(e)=> setName(e.target.value)}
               value= {name}
               disabled={isLoading}
            />
            <Input
               placeholder="Username"
               onChange={(e)=> setUsername(e.target.value)}
               value= {username}
               disabled={isLoading}
            />
            <Input
               placeholder="Password"
               type="password"
               onChange={(e)=> setPassword(e.target.value)}
               value= {password}
               disabled={isLoading}
            />

        </div>
    )
    const footerContent = (

        <div className="text-neutral-400 text-center mt-2">
            <p>Already have an account?
                <span
                  onClick={onToggle}
                  className="
                      text-white
                      cursor-pointer
                      hover:underline
                  "
                >Sign in</span>
            </p>
        </div>

    )


    const modalProps: ModalProps = {
        disabled: isLoading,
        isOpen: registerModal.isOpen,
        title: "Create an account",
        actionLabel: "Register",
        onClose: registerModal.onClose,
        onSubmit: onSubmit,
        body: bodyContent,
        footer: footerContent,
    };

    

    return (

    <Modal {...modalProps} />

    );
}


export default RegisterModal;
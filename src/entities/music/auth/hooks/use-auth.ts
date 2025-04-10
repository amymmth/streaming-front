import {makeVar, useReactiveVar} from '@apollo/client';
import {v4 as uuidv4} from 'uuid';
import {Auth} from 'entities/music/auth';
import {useRegisterUserMutation} from 'shared/api/music-generation/combined.generated.tsx';
import {useEffect, useState} from 'react';

export const authVar = makeVar<Auth>({
    userId: localStorage.getItem('userId') || undefined,
});

const isRegisteringVar = makeVar<boolean>(false);

export const useLogin = () => {
    const userId = localStorage.getItem('userId');
    const {register} = useUserRegister();
    const [isLoggedIn, setIsLoggedIn] = useState(!!userId);

    useEffect(() => {
        if (!isLoggedIn && !isRegisteringVar()) {
            isRegisteringVar(true);
            register()
                .then(() => {
                    setIsLoggedIn(true);
                })
                .finally(() => {
                    isRegisteringVar(false);
                });
        }
    }, [isLoggedIn, register]);

    return {isLoggedIn};
}

export const useAuth = (reactiveVar = authVar) => {
    const {userId} = useReactiveVar(reactiveVar);

    return {userId: userId as string};
};

const useUserRegister = () => {
    const [registerUserMutation] = useRegisterUserMutation();

    const register = async () => {
        const userId = uuidv4();
        const data = await registerUserMutation({variables: {userId}})
        const registerUser = data?.data?.registerUser;
        if (!registerUser) return;
        const {id} = registerUser;
        authVar({userId: id});
        localStorage.setItem('userId', id);
    }
    return {register};
}
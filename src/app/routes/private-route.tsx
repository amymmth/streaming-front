import {Navigate} from "react-router-dom";
import {useAuth} from "app/providers/auth/auth-provider.tsx";
import {Button} from "shared/ui/button.tsx";

export const PrivateRoute = ({children}: { children: JSX.Element }) => {
    const {logout} = useAuth();


    const user = window.localStorage.getItem('user');

    return user ? (
        <>
            <Button size={'icon'} variant={'link'} className={'absolute top-0 right-0 z-10'} onClick={logout}></Button>
            {children}
        </>
    ) : (
        <Navigate to="/login"/>
    );
};
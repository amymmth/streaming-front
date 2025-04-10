import {AuthProvider} from "app/providers/auth/auth-provider.tsx";
import {Routes} from "app/routes";
import {ApolloProvider} from "@apollo/client";
import {useClient} from "apollo/useClient.tsx";
import {useEffect} from "react";


const App = () => {
    const {client} = useClient();
    useEffect(() => {
        const disableContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        document.addEventListener('contextmenu', disableContextMenu);

        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
        };
    }, []);



    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </ApolloProvider>
    )
};

export default App




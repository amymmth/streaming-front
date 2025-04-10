import { useMemo } from "react";
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { MUSIC_GENERATION_ENTRYPOINT } from "shared/config";

/**
 * Хук для инициализации клиента
 */
export const useClient = () => {
    /**
     * Инициализация API.baseUrl
     */
    const httpLink = useMemo(() => {
        return createHttpLink({
            uri: MUSIC_GENERATION_ENTRYPOINT as string,
            credentials: "same-origin",
        });
    }, []);

    /**
     * Логика обработки ошибок
     */
    const errorLink = useMemo(() => {
        return onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.forEach(({ message, locations, path }) => {
                    console.error(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    );
                });
            }
            if (networkError) {
                console.error(`[Network error]: ${networkError}`);
            }
        });
    }, []);

    /**
     * Логика повторных запросов
     */
    const retryLink = useMemo(() => {
        return new RetryLink({
            delay: {
                initial: 300,
                max: Infinity,
                jitter: true,
            },
            attempts: {
                max: 3,
                retryIf: (error, _operation) => {
                    return !!error && error.message.includes("Failed to fetch");
                },
            },
        });
    }, []);

    /**
     * Инициализация инстанса клиента
     */
    const client = useMemo(() => {
        return new ApolloClient({
            link: ApolloLink.from([retryLink, errorLink, httpLink]),
            cache: new InMemoryCache(),
        });
    }, [httpLink, errorLink, retryLink]);

    return { client };
};

import {createContext, useContext, useEffect, useRef, useState, ReactNode, FC} from 'react';
import {io, Socket} from 'socket.io-client';
import {API_URL} from 'shared/constants/API_URL.ts';
import {Payload} from "./types.ts";

interface SocketContextProps {
    createNewSession: (payload: Payload) => void;
    updateSession: (payload: Payload) => void;
    getChunks: () => void;
    chunk: ArrayBuffer | undefined;
    closeConnection: () => void;
    isConnected: boolean;
    isLoading: boolean;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: FC<{ children: ReactNode }> = ({children}) => {
    const socketRef = useRef<Socket | null>(null);
    const [chunk, setChunk] = useState<ArrayBuffer>();
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [shouldCreateSession, setShouldCreateSession] = useState<Payload | null>(null); // Новое состояние

    useEffect(() => {
        const socket = io(API_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Подключение к серверу");
            setIsConnected(true);

            if (shouldCreateSession) {
                createNewSession(shouldCreateSession);
                setShouldCreateSession(null);
            }
        });

        socket.on("connect_error", (err) => {
            console.error("Ошибка подключения:", err);
            setIsLoading(true);
        });

        socket.on("disconnect", () => {
            console.log("Отключение от сервера");
            setIsConnected(false);
        });

        socket.on("new_session", (data) => {
            console.log("Новая сессия запущена:", data);
            getChunks();
        });

        socket.on("update_session", (data) => {
            console.log("Сессия обновлена:", data);
        });

        socket.on("chunks", async (chunk: ArrayBuffer) => {
            console.log('chunks', chunk)
            setChunk(chunk);
            setIsLoading(false);
        });

        socket.on("error", (error) => {
            console.error("Ошибка сокета:", error);
            setIsLoading(false);
        });

        return () => {
            socket.disconnect();
            setIsConnected(false);
        };
    }, [shouldCreateSession]);

    const createNewSession = (payload: Payload) => {
        setIsLoading(true);

        if (isConnected) {
            console.log(payload)
            socketRef.current?.emit("new_session", {
                payload: {
                    station: payload.station,
                    knobs: payload.knobs.map(k => Number(((k + 10) * 0.1).toFixed(1))),
                }
            } as never);
        } else {
            setShouldCreateSession(payload);
        }
    };

    const updateSession = (payload: Payload) => {
        console.log('updateSession', payload)
        setIsLoading(true);
        socketRef.current?.emit("update_session", {
            payload: {
                station: payload.station,
                knobs: payload.knobs.map(k => Number(((k + 10) * 0.1).toFixed(1))),
            }
        } as never);
    };

    const getChunks = () => {
        setIsLoading(true);
        socketRef.current?.emit("chunks");
    };

    return (
        <SocketContext.Provider value={{
            createNewSession,
            updateSession,
            getChunks,
            chunk,
            isLoading,
            closeConnection: () => {
                socketRef.current?.disconnect()
                setIsConnected(false)
            },
            isConnected
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

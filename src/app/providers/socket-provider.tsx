// src/app/providers/socket-provider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import {API_URL} from "shared/constants/API_URL.ts";

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(API_URL);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Подключено к серверу');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Отключено от сервера');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket должен использоваться внутри SocketProvider');
    }
    return context;
};

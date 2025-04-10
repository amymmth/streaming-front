import {BrowserRouter as Router, Navigate, Route, Routes as ReactRoutes} from "react-router-dom";
import {MusicGeneratorPage} from "pages/music-generator-page";
import {RadioPage} from "pages/radio-page";
import {PrivateRoute} from "app/routes/private-route.tsx";
import {SocketProvider} from "app/providers/socket/socket-context.tsx";
import {AuthPage} from "pages/auth-page";


export const Routes = () => (
    <Router>
        <ReactRoutes>
            <Route
                path="/music-generator"
                element={
                    <PrivateRoute>
                        <MusicGeneratorPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/radio"
                element={
                    <PrivateRoute>
                        <SocketProvider>
                            <RadioPage/>
                        </SocketProvider>
                    </PrivateRoute>
                }
            />
            <Route path="/login" element={<AuthPage/>}/>
            <Route path="/" element={<Navigate to="/music-generator" replace/>}/>
        </ReactRoutes>
    </Router>
);


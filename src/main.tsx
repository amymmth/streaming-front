import React from 'react'
import ReactDOM from 'react-dom/client'
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import App from 'app/App.tsx'
import './index.css'

const client = new ApolloClient({
    cache: new InMemoryCache(),
});


window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});


document.title = 'Генератор музыки';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
)


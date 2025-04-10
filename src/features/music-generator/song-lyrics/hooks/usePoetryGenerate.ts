import {useLyrics} from "entities/music/lyrics";
import {useMusicStyles} from "entities/music/music-styles";
import {useAuth} from "entities/music/auth";
import {
    GeneratePoemInput,
    usePoetryGenerateMutation,
    usePoetryGetResultLazyQuery
} from "shared/api/music-generation/combined.generated.tsx";
import {useAsyncProcess} from "shared/hooks/useAsyncProcess.ts";
import {PoetryEntity} from "shared/api/types.ts";
import {useEffect, useRef, useState} from "react";
import {makeVar} from "@apollo/client";


export const poetryGeneratingVar = makeVar<boolean>(false);

export const usePoetryGenerate = () => {
    const [generatePoetryMutation] = usePoetryGenerateMutation();
    const [getPoetryResultQuery] = usePoetryGetResultLazyQuery({
        fetchPolicy: 'network-only',
    });
    // const {lyrics} = useLyrics();
    const {musicStyles} = useMusicStyles();
    const {userId} = useAuth();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    let resolveResult: (result: PoetryEntity) => void;

    const {startProcess, loading: asyncProcessLoading, error: asyncProcessError, userStopProcess} = useAsyncProcess({
        generateFunction: generatePoetryMutation,
        getResultFunction: (queryId) => getPoetryResultQuery({variables: {poetryId: queryId}}),
        onSuccess: (result) => {
            if (resolveResult) {
                resolveResult(result as unknown as PoetryEntity);
                poetryGeneratingVar(false);
            }
        },
        onInitialSuccess: (result) => {
            if (result?.poetryGenerate?.status === 'CENSORED' ) {
                userStopProcess();
                setError('Описание песни не соответствует политике безопасности');
                poetryGeneratingVar(false);
            }
            if (result?.poetryGenerate?.estimation >= 30) {
                userStopProcess();
                poetryGeneratingVar(false);
            }
        },
        estimationSeconds: 1,
        statusKeys: {
            ready: 'READY',
            cancelled: 'CANCELLED',
            censored: 'CENSORED',
        },
        generateKey: 'poetryGenerate',
        resultKey: 'poetryGetResult',
        queryIdKey: 'id',
        estimationKey: 'estimation',
    });

    const createPoetry = (lyrics?: string) => {
        intervalRef.current = setTimeout(() => {
            userStopProcess();
            setError('Генерация была отменена спустя 30 секунд.')
            poetryGeneratingVar(false);
        }, 30000);

        poetryGeneratingVar(true);

        return new Promise((resolve, reject) => {
            resolveResult = resolve;


            startProcess({
                variables: {
                    input: {
                        genre: musicStyles,
                        userId: userId,
                        requestText: `напиши стихотворение, 12 строк, на тему ${lyrics || 'любовь'}`,
                    } as GeneratePoemInput,
                },
            })
                .then(() => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }) // Убираем таймер, если процесс завершился раньше 30 секунд
                .catch((err) => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    reject(err);
                    setError(err);
                });
        });
    };

    useEffect(() => {
        if (asyncProcessError) {
            setError(asyncProcessError);
            poetryGeneratingVar(false);
        }
    }, [asyncProcessError]);

    useEffect(() => {
        if (asyncProcessLoading) {
            poetryGeneratingVar(asyncProcessLoading);
        }
    }, [asyncProcessLoading]);

    return {createPoetry, loading, error};
};

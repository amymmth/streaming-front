"use client"

import { useRef, useState } from "react"
import type { FetchResult } from "@apollo/client"

type StatusKeys = {
    ready: string
    cancelled: string
    censored: string
}

type UseAsyncProcessParams<T, R, E> = {
    generateFunction: (params: T) => Promise<FetchResult<R>>
    getResultFunction: (queryId: string) => Promise<FetchResult<E>>
    onInitialSuccess?: (initialResult: R) => void
    onSuccess: (finalResult: E) => void
    onError?: (error: string) => void
    estimationSeconds?: number
    statusKeys: StatusKeys
    resultKey: string
    generateKey: string
    queryIdKey: string
    estimationKey: string
}

export const useAsyncProcess = <T, R, E>(props: UseAsyncProcessParams<T, R, E>) => {
    const {
        generateFunction,
        getResultFunction,
        onInitialSuccess,
        onSuccess,
        onError,
        estimationSeconds = 1,
        statusKeys,
        resultKey,
        queryIdKey,
        generateKey,
        estimationKey = "estimationSeconds",
    } = props

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const queryIdRef = useRef<string | null>(null)

    const startProcess = async (params: T) => {
        setLoading(true)
        setError(null)

        try {
            // Выполнение generateFunction и получение начального результата
            const initialResponse = await generateFunction(params)
            const initialResult = initialResponse.data as R

            if ((initialResult as { [key: string]: never })?.[generateKey]?.["status"] === statusKeys.censored) {
                console.log("censored", (initialResult as { [key: string]: never })?.[generateKey]?.["status"])
                if (onError) {
                    onError("Описание песни не соответствует политике безопасности")
                }
                setError("Описание песни не соответствует политике безопасности")
                stopProcess()
                return
            } else {
                if (onInitialSuccess) {
                    onInitialSuccess(initialResult)
                }
                const queryId = (initialResult as { [key: string]: never })?.[generateKey]?.[queryIdKey]
                const waitTime =
                    (
                        initialResult as {
                            [key: string]: never
                        }
                    )?.[generateKey]?.[estimationKey] || estimationSeconds

                if (!queryId) {
                    throw new Error("Query ID не получен.")
                }

                queryIdRef.current = queryId
                pollStatus(waitTime)
            }
        } catch (error) {
            console.error("Ошибка при запуске процесса:", error)
            setError("Ошибка запуска процесса.")
            setLoading(false)
        }
    }

    const pollStatus = (waitTime: number) => {
        let time = waitTime
        intervalRef.current = setInterval(async () => {
            try {
                if (!queryIdRef.current) return
                const resultResponse = await getResultFunction(queryIdRef.current)
                const resultData = (resultResponse.data as { [key: string]: never })[resultKey]

                const status = (resultData as { [key: string]: never })["status"]

                if (status === statusKeys.ready) {
                    if (queryIdRef.current) onSuccess(resultData as E)
                    stopProcess()
                    setLoading(false)
                } else if (status === statusKeys.cancelled) {
                    stopProcess()
                    setError("Процесс отменен.")
                    setLoading(false)
                } else if (status === statusKeys.censored) {
                    stopProcess()
                    setError("Описание песни не соответствует политике безопасности")
                    setLoading(false)
                }
                // Обновляем waitTime на основе результата, если он присутствует
                if (resultData?.[estimationKey]) {
                    time = resultData[estimationKey]
                }
            } catch (error) {
                stopProcess()
                setError("Ошибка получения результата.")
                console.error("Ошибка при опросе статуса:", error)
            }
        }, time * 1000)
    }

    const stopProcess = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        queryIdRef.current = null
        setLoading(false)
    }

    const userStopProcess = () => {
        console.log("Процесс отменен.")
        stopProcess()
    }

    return { startProcess, loading, error, userStopProcess }
}

/**
 * __useAsyncProcess__
 *
 * Хук `useAsyncProcess` предназначен для управления асинхронным процессом с повторяющимися запросами.
 * Он позволяет запускать процесс, выполнять начальный запрос, а затем периодически проверять статус выполнения
 * до завершения. Хук гибко настраивается с учетом специфики статусов и ключей, возвращаемых вашим API.
 *
 * @template T - Тип параметров, передаваемых в `generateFunction`.
 * @template R - Тип результата, возвращаемого из `getResultFunction`.
 * @template E - Тип результата, возвращаемого из `onSuccess`.
 *
 * @param {Object} params - Параметры конфигурации.
 * @param {(params: T) => Promise<{ data: Record<string, any> }>} params.generateFunction - Функция для запуска асинхронного процесса.
 * @param {(queryId: string) => Promise<{ data: Record<string, any> }>} params.getResultFunction - Функция для периодической проверки статуса процесса.
 * @param {(result: R) => void} params.onInitialSuccess - Колбэк, вызываемый при получении начального результата.
 * @param {(result: R) => void} params.onSuccess - Колбэк, вызываемый при успешном завершении процесса.
 * @param {(error: string) => void} [params.onError] - Колбэк для обработки ошибок, возникающих в процессе выполнения.
 * @param {number} [params.estimationSeconds=1] - Начальное время ожидания между запросами в секундах (если не указано в ответе от API).
 * @param {StatusKeys} params.statusKeys - Объект с названиями статусов, возвращаемых API.
 * @param {string} params.statusKeys.ready - Название статуса, когда процесс завершен и готов.
 * @param {string} params.statusKeys.cancelled - Название статуса для отмененного процесса.
 * @param {string} params.statusKeys.unknownQueryId - Название статуса для неизвестного `queryId`.
 * @param {string} params.resultKey - Ключ для доступа к результату внутри `resultResponse.data`.
 * @param {string} params.queryIdKey - Ключ для доступа к `queryId` в начальном ответе от `generateFunction`.
 * @param {string} params.estimationKey - Ключ для доступа к `estimationSeconds` в ответе от `getResultFunction`.
 *
 * @returns {Object} - Объект с состоянием и методами:
 *   - `startProcess`: Функция для запуска асинхронного процесса с передачей параметров.
 *   - `loading`: Состояние загрузки, указывающее на выполнение процесса.
 *   - `error`: Сообщение об ошибке (если возникла ошибка).
 *
 * @example
 * const {startProcess, loading, error} = useAsyncProcess({
 *      generateFunction: generateSpeechMutation,
 *      getResultFunction: getSpeechResult,
 *      onSuccess: (result) => {
 *          const resultFileUrl = result.resultFileUrl;
 *          if (resultFileUrl) {
 *              setFileSrc(resultFileUrl);
 *          }
 *      },
 *      onError: (message) => setError(message),
 *      estimationSeconds: 1, // Начальное значение, если не указано в response
 *      statusKeys: {
 *          ready: 'Ready',
 *          cancelled: 'Cancelled',
 *          unknownQueryId: 'UnknownQueryId'
 *      },
 *      resultKey: 'getResult', // Название ключа результата в response
 *      queryIdKey: 'queryId', // Ключ для queryId в начальном ответе
 *      estimationKey: 'estimationSeconds' // Ключ для estimationSeconds в ответе
 * });
 *
 * // Запуск процесса
 * startProcess({
 *      text: phrase,
 *      voiceId: voice.id,
 *      isSSMLText: false,
 *      mode: 'models/valle_24khz/synth',
 *      userSession: sessionId,
 * });
 */

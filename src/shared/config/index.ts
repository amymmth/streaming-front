/**
 * Модуль инициализации env-переменных
 * @remark Если не найдено значение хоть одной переменной,
 * Приложение сразу выбросит ошибку, при инициализации модуля
 * @module
 */

/**
 * Получение env-переменной
 * @throwable
 */
export const getEnvVar = (key: keyof ImportMeta['env']) => {
    if (import.meta.env[key] === undefined) {
        throw new Error(`Env variable ${key} is required`);
    }
    return import.meta.env[key] || "";
};

/** @symphormer API entrypoint */
export const MUSIC_GENERATION_ENTRYPOINT = getEnvVar("VITE_MUSIC_GENERATION_ENTRYPOINT");

/** @symphormer URL радио потока */
export const SERVER_URL = getEnvVar("VITE_STREAM_URL");

/** Режим запуска программы */
export const NODE_ENV = getEnvVar("MODE");
/** Режим разработки */
export const isDevEnv = NODE_ENV === "development";
/** Режим продакшена */
export const isProdEnv = NODE_ENV === "production";

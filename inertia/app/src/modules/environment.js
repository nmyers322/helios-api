export const getEnv = () => {
    return import.meta.env.VITE_REACT_APP_ENV || 'local';
};

export const isLocal = () => getEnv() === 'local';

export const isTest = () => getEnv() === 'test';

export const isProd = () => getEnv() === 'production';

export const isDebug = () => import.meta.env.VITE_REACT_APP_DEBUG_LOGGING === "true";
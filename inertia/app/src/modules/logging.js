import { isDebug, isLocal, isTest } from "./environment";

export const heliosLogger = (...messages) => {
    if (isLocal() || isTest() || isDebug()) {
        console.log(...messages);
    }
}
/**
 * 指定ミリ秒後に解決されるPromiseを返す関数
 * @param ms 待つミリ秒数
 * @returns 指定ミリ秒後に解決されるPromise
 */
const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(() => resolve(), ms));

export default sleep;

import { DEFAULT_API_TIMEOUT } from './config';

export async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_API_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    console.log('Ждём ответа от сервера...');
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа от сервера');
    }
    throw error;
  }  finally {
    // всегда чистим таймер
    clearTimeout(id); 
  }
}

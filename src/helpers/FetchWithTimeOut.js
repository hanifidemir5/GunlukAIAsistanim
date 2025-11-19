export function fetchWithTimeout(apiFunc, timeout = 5000) {
  return Promise.race([
    apiFunc(), // call the function to get the promise
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout),
    ),
  ]);
}

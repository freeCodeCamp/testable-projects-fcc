// Promisify setTimeout
export const timeout = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

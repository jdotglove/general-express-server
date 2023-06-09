import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;
const redisUrl = process.env.REDIS_URL;

const client = createClient({
  url: redisUrl,
});

client.on('error', (err: any) => {
  console.log('Redis Error:', err);
});

export const connectionPromise = client.connect();

async function waitForConnection() {
  await connectionPromise;
}
export async function redisClientDo(command: any, ...args: any) {
  ensureValidCmd(command);
  await waitForConnection();
  // @ts-ignore need to fix command typing
  return client[command](...args);
}
/**
 *
 * @param {string} command
 * @returns boolean
 */
function isValidCmd(command: any) {
  return command in client;
}
/**
 *
 * @param {string} command
 */
function ensureValidCmd(command: any) {
  if (!isValidCmd(command)) {
    throw new Error(`Unknown redis command: ${command}`);
  }
}
export async function redisClientDoAll(...cmdArgsArray: any) {
  cmdArgsArray.forEach(([command]: any) => ensureValidCmd(command));
  await waitForConnection();
  //@ts-ignore figure out tuple
  return Promise.all(cmdArgsArray.map((cmdAndArgs: any) => redisClientDo(...cmdAndArgs)));
}
export async function redisClientDoAllInSequence(...cmdArgsArray: any) {
  cmdArgsArray.forEach(([command]: any) => ensureValidCmd(command));
  await waitForConnection();
  return cmdArgsArray.reduce(
    (prev: any, [command, ...args]: any) => prev.then(() => redisClientDo(command, ...args)),
    Promise.resolve(),
  );
}
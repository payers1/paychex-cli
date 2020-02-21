import { spawnSync } from 'child_process';

export const getPassword = () => {
  const { stdout } = spawnSync('security', [
    'find-internet-password',
    '-s',
    'paychex.com',
    '-w'
  ]);
  return stdout.toString();
};

export const hasPassword = () => Boolean(getPassword());

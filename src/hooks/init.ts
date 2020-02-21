import { Hook } from '@oclif/config';
const Conf = require('conf');
const { spawnSync } = require('child_process');
const { Input, Password } = require('enquirer');
import { hasPassword } from '../utils/keychain';

export const credentials: Hook.Init = async function() {
  const config = new Conf();

  if (!config.has('username')) {
    const prompt = new Input({
      message: 'What is your username?'
    });
    const username = await prompt.run();
    config.set('username', username);
  }

  if (!hasPassword()) {
    const password = await new Password({
      message: 'Enter your password'
    }).run();
    spawnSync('security', [
      'add-internet-password',
      '-a',
      config.get('username'),
      '-s',
      'paychex.com',
      '-w',
      password,
      '-U'
    ]);

    if (!config.has('token_id')) {
      this.error('Missing token id!');
    }

    if (!config.has('client_token')) {
      this.error('Missing client_token!');
    }
  }
};

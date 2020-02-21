import { Command } from '@oclif/command';
import puppeteer = require('puppeteer');
import { getPassword } from '../utils/keychain';
const Conf = require('conf');
const { Input } = require('enquirer');

export default class Login extends Command {
  async run() {
    const config = new Conf();

    this.log('logging in...');

    // log in
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--user-data-dir=/Users/payers/Library/Application Support/Google/Chrome/Default'
      ]
    });
    const page = await browser.newPage();
    await page.goto('https://myapps.paychex.com/');

    const frame = page.frames().find(frame => frame.name() === 'login');

    await frame?.waitForSelector('#USER', { timeout: 3000 });

    await frame?.type('#USER', config.get('username'));

    await frame?.click(
      '#usernameForm > div > div:nth-child(2) > div:nth-child(3) > button'
    );

    // check for OTP and prompt if necessary
    try {
      await frame?.waitForSelector('#otpCode', { timeout: 3000 });
      this.log('Received 2FA challenge...');
      const otpCode = await new Input({ message: 'Enter OTP' }).run();
      await frame?.type('#otpCode', otpCode);
      await frame?.click(
        'button[data-payxautoid="paychex.app.login.authentication.legacy.validateOTP.continue"]'
      );
    } catch (error) {}

    await frame?.waitForSelector('input[name="PASSWORD"]');

    const keychainPassword = getPassword();
    await frame?.type('input[name="PASSWORD"]', keychainPassword);

    await frame?.click(
      'button[data-payxautoid="paychex.app.login.userPassword.next"]'
    );

    await page.waitForSelector(
      '#subapp-container > div.angular-subapp-wrapper.loaded',
      { timeout: 3000 }
    );

    const newPage = await browser.newPage();

    await newPage.goto(
      'https://ws.paychex.com/svcs/security/idp/StratustimeV2.5?clientId=67570%3A13085948'
    );

    await newPage.waitFor(() => !!window.AppOne && !!window.AppOne.Core);

    await newPage.evaluate(config => {
      window.AppOne.Core.Application.invoke('Security', null, function(
        clientToken: any
      ) {
        config.set({
          client_token: clientToken['clientToken'],
          token_id: window.AppOne.Core.SessionController.getTokenID(),
          user_id: window.AppOne.Core.SessionController.currentPrincipal.UserID
        });
      });
    }, config);

    await browser.close();
  }
}

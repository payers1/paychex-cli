import { Command, flags } from '@oclif/command';
import puppeteer = require('puppeteer');
const Conf = require('conf');

export default class Hello extends Command {
  static description = 'Login to paychex and get tokens';

  static examples = [`$ pchx hello hello world from ./src/hello.ts!`];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  };

  static args = [{ name: 'file' }];

  async run() {
    const config = new Conf();
    console.log({ configPath: config.path });

    const { args, flags } = this.parse(Hello);

    this.log('logging in...');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://myapps.paychex.com/');

    await page.waitForSelector(
      '#subapp-container > div.angular-subapp-wrapper.loaded',
      { timeout: 0 }
    );

    const newPage = await browser.newPage();

    await newPage.goto(
      'https://ws.paychex.com/svcs/security/idp/StratustimeV2.5?clientId=67570%3A13085948'
    );

    await newPage.waitFor(() => !!window.AppOne && !!window.AppOne.Core, {
      timeout: 0
    });

    const shit = {};

    const result = await newPage.evaluate(x => {
      return new Promise((resolve, reject) => {
        window.AppOne.Core.Application.invoke('Security', null, function(
          clientToken: any
        ) {
          console.log(clientToken);
          x['clientToken'] = clientToken['clientToken'];
          x['tokenId'] = window.AppOne.Core.SessionController.getTokenID();
          resolve(x);
        });
      });
    }, shit);

    config.set('clientToken', result.clientToken);
    config.set('tokenId', result.tokenId);

    console.log('QUERY PARAMS', result);

    await browser.close();
  }
}

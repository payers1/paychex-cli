import { Command } from '@oclif/command';
import axios from 'axios';
import { DateTime } from 'luxon';
const Conf = require('conf');
const config = new Conf();
import UserAgent from 'user-agents';
import { cli } from 'cli-ux';

export default class GetTimeCard extends Command {
  static description = 'Get Time Card';

  parseResponse(response: any) {
    return response.data['TimeSlicePostData']
      .map(item => ({
        hours: item['TotalRegularDuration'] / 60 / 60,
        type: item['SummaryLineDetails']['PayTypeName'],
        date: item['SummaryLineDetails']['RoundedDateTimeIn'].replace(
          new RegExp(/\D+/g),
          ''
        )
      }))
      .map(({ date, ...rest }) => ({
        date: date.slice(0, 10),
        ...rest
      }))
      .map(({ date, ...rest }) => ({
        date: parseInt(date),
        ...rest
      }))
      .map(({ date, ...rest }) => ({
        date: DateTime.fromSeconds(date),
        ...rest
      }))
      .map(({ date, ...rest }) => ({
        date: date.toLocaleString(),
        ...rest
      }));
  }

  async run() {
    const params = new URLSearchParams();
    params.append('UserID', config.get('user_id'));
    params.append('From', '2020-01-01');
    params.append('To', '2020-03-26');

    const tokenId = config.get('token_id');
    const clientToken = config.get('client_token');
    const userAgent = new UserAgent();

    try {
      const response = await axios({
        method: 'POST',
        params: {
          t: tokenId
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent.toString(),
          Cookie: `t${tokenId}=${clientToken}`
        },
        data: params,
        url:
          'https://paychex.centralservers.com/Dashboard/TimeCard/GetTimeSlicePost'
      });
      console.log(`STATUS: ${response.status}`);

      const data = this.parseResponse(response);

      cli.table(data, {
        date: { header: 'DATE' },
        hours: { header: 'HOURS' },
        type: { header: 'TYPE' }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

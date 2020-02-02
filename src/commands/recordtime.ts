import { Command } from '@oclif/command';
import axios from 'axios';
import { DateTime } from 'luxon';
const Conf = require('conf');
const config = new Conf();
const { Form } = require('enquirer');
import UserAgent from 'user-agents';

export default class RecordTime extends Command {
  static description = 'describe the command here';

  async run() {
    const { args, flags } = this.parse(RecordTime);

    const prompt = new Form({
      name: 'user',
      message: 'Please provide the following information:',
      choices: [
        { name: 'month', message: 'Month', initial: '2' },
        { name: 'day', message: 'Day', initial: '2' },
        { name: 'year', message: 'Year', initial: '2020' },
        { name: 'startTime', message: 'In', initial: '8' },
        { name: 'hours', message: 'Hours', initial: '8' }
      ]
    });

    const value = await prompt.run();
    const start_dt = DateTime.fromObject({
      day: value.day,
      month: value.month,
      hour: value.startTime,
      zone: 'America/New_York'
    });

    this.log(value);
    this.log(start_dt.toISO());

    const end_date = start_dt.plus({ hours: 8 });

    this.log(end_date.toISO());

    const params = new URLSearchParams();
    params.append(
      'TimeSlicePost',
      JSON.stringify({
        UserID: 23,
        TypeIn: '2',
        SupervisorApprovedIn: false,
        ActualDateTimeIn: start_dt.toISO(),
        SupervisorNoteIn: '',
        TypeOut: '3',
        SupervisorApprovedOut: false,
        ActualDateTimeOut: end_date.toISO(),
        SupervisorNoteOut: '',
        LaborLevel: ['46', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '8', '138']
      })
    );
    params.append('AddType', '2');

    const tValue = config.get('tokenId');
    const clientToken = config.get('clientToken');
    const userAgent = new UserAgent();

    try {
      const x = await axios({
        method: 'POST',
        params: {
          t: tValue
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent.toString(),
          Cookie: `t${tValue}=${clientToken}`
        },
        data: params,
        url:
          'https://paychex.centralservers.com/Dashboard/TimeCard/AddTimeSlicePost'
      });
      console.log('x', x.data);
    } catch (error) {
      console.log(error);
    }
  }
}

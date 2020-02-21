import { Command } from '@oclif/command';
import axios from 'axios';
import { DateTime } from 'luxon';
const Conf = require('conf');
const config = new Conf();
const { Confirm, Form, Select } = require('enquirer');
import UserAgent from 'user-agents';

export default class AddShift extends Command {
  static description = 'Add Shift';

  static PAY_TYPES_TO_ID_MAP = {
    Regular: '-5',
    Work: -1,
    Holiday: 1,
    Unpaid: 2,
    Bereavement: 3,
    'Jury Duty': 4,
    Vacation: 6,
    PTO: 7
  };

  async run() {
    await new Select({ name: 'type', choices: ['Work', 'PTO'] }).run();

    const prompt = new Form({
      name: 'user',
      message: 'Please provide the following information:',
      choices: [
        {
          name: 'month',
          message: 'Month',
          initial: DateTime.local().month.toString()
        },
        {
          name: 'day',
          message: 'Day',
          initial: DateTime.local().day.toString()
        },
        {
          name: 'year',
          message: 'Year',
          initial: DateTime.local().year.toString()
        },
        { name: 'hours', message: 'Hours', initial: '8' }
      ]
    });

    const { day, month } = await prompt.run();
    const start_dt = DateTime.fromObject({
      day,
      month,
      hour: 8,
      zone: 'America/New_York'
    });
    const end_date = start_dt.plus({ hours: 8 });

    this.log(start_dt.toISO());
    this.log(end_date.toISO());

    const confirmation = await new Confirm({
      name: 'confirm',
      message: `Add 8 hours for ${start_dt.toLocaleString(DateTime.DATE_HUGE)}?`
    }).run();

    if (!confirmation) {
      return;
    }

    const params = new URLSearchParams();
    params.append(
      'TimeSlicePost',
      JSON.stringify({
        UserID: config.get('user_id'),
        TypeIn: '2',
        SupervisorApprovedIn: true,
        ActualDateTimeIn: start_dt.toISO(),
        SupervisorNoteIn: '',
        TypeOut: '3',
        SupervisorApprovedOut: true,
        ActualDateTimeOut: end_date.toISO(),
        SupervisorNoteOut: '',
        LaborLevel: ['46', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '8', '138']
      })
    );
    params.append('AddType', '2');

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
          'https://paychex.centralservers.com/Dashboard/TimeCard/AddTimeSlicePost'
      });
      console.log(`STATUS: ${response.status}`);
    } catch (error) {
      console.log(error);
    }
  }
}

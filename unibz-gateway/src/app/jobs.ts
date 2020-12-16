import axios from 'axios';
import config from '../config';
import { getInfo } from './core';

export const sendUniversityInfo = async () => {
  console.log('Sending periodic info to universities gateway..');
  await axios.post('http://' + config.UNIVERSITIES_GATEWAY_URI + '/university', getInfo());
};

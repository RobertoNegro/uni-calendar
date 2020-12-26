import config from '../config';
import { getInfo } from './core';
import axios from 'axios'

export const sendUniversityInfo = async () => {
  console.log('Sending periodic info to universities gateway..');
  await axios.post('http://' + config.UNIVERSITIES_GATEWAY_URI + '/university', getInfo());
};

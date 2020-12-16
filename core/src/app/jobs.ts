import axios from 'axios';

export const updateUniBz = async () => {
  console.log('Sending periodic update to unibz gateway..');
  await axios.get('http://unibz_gateway/updateCache');
};

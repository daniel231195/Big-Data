import axios from 'axios';

const baseUrl = `http://localhost:3002`;

export const getAssociation = async () => {
    return axios.get(`${baseUrl}/batch/getAssociation`);
  };
  
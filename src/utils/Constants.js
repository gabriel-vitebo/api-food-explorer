const dotenv = require('dotenv');
dotenv.config();


const productionUrl = "https://foodexplorerapi-6dz6.onrender.com";
const developmentUrl = "http://localhost:3333";

const baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : developmentUrl;

module.exports = {
  baseUrl,
};

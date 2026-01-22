import { Client, Environment } from 'square';

export const squareClient = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export const PREMIUM_PRICE_CENTS = 199; // $1.99

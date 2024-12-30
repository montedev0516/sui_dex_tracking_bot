import express from 'express';
import cors from 'cors';
import connectDB from './lib/dbConnect';
import bodyParser from 'body-parser';
import { commands } from './constant/constant';
import { userRegister } from './component/bot';
import UserInfo from './models/models';
import { suiClient } from './component/bot';
import { balance, fetchTxToken, swapCoin7k } from './component/bot';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import BN from 'bn.js';

const TelegramBot = require('node-telegram-bot-api');

const SUI = '0x2::sui::SUI';

export const bot = new TelegramBot(
  '7219556679:AAFStUdKAZK1ZxXHk4CbIZICvdIWBijwwzs',
  {
    polling: true,
  }
);

const app = express();
const port: number = 3001;

connectDB();
app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

export const startOption = {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [[{ text: '❌ Close', callback_data: 'delete' }]],
  },
};
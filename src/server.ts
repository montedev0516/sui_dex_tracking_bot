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

let intervalId: any;

bot.setMyCommands(commands);

bot.onText(/^\/start(?: ref_(\w+))?$/, async (message: any) => {
  const chatId = message.chat.id;
  await userRegister(chatId, message.chat.username);
  const address = await UserInfo.find({ userId: chatId }).select([
    'address0',
    'key0',
  ]);

  const welcomeMessage = `👋   Hello! Welcome to the SUI Tract Bot on BlueMove and Turbo      \n\nThis is your wallet address.\n <code>${address[0].address0}</code> \n\n This is your wallet private key.\n <code>${address[0].key0}</code> \n\n🚀If you want to start bot, you should input only token address like \n0xd9773016f31a1216fb0a1e0b0937f09687663807e8cb8a19ba5a12f2f5dcab88::suijak::SUIJAK \n\n  `;
  bot.sendMessage(chatId, welcomeMessage, startOption);
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

  bot.on('message', async (msg: any) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const input = String(messageText).split(' ');
    const coinType = String(messageText).split('::');
    const address = await UserInfo.find({ userId: chatId }).select([
      'address0',
      'key0',
      'working',
    ]);
    console.log('i am coin', coinType, msg.chat.username);
    try {
      if (address[0]?.address0) {
        if (coinType[0].length != 66 || !input[0].startsWith('0x')) {
          if (!coinType[0].includes('start') && !coinType[0].includes('stop'))
            bot.sendMessage(chatId, 'Wrong type for coin address.');
        } else {
          const suiBalance = await suiClient.getBalance({
            owner: address[0]?.address0,
            coinType: SUI,
          });
  
          console.log('bal===', balance(suiBalance.totalBalance), chatId);
  
          if (suiBalance.totalBalance != '0') {
            bot.sendMessage(chatId, `🚀 Bot is running now!`);
            let previousAmount: any = null;
            intervalId = setInterval(async () => {
              const data = await fetchTxToken(messageText);
              const tokenBalance = await suiClient.getBalance({
                owner: address[0]?.address0,
                coinType: messageText,
              });
  
              console.log('token balance=====', tokenBalance);
              if (data?.amount !== previousAmount) {
                previousAmount = data?.amount;
  
                if (data?.amount) {
                  // if (data?.amount > suiBalance.totalBalance) {
                  console.log('bal', data?.amount, tokenBalance.totalBalance);
                  // }
                  if (
                    Number(tokenBalance.totalBalance) <
                    Number(data?.amount) / 2
                  ) {
                    bot.sendMessage(
                      chatId,
                      `😞 Token Sell is failed.\n Tracked Buy Transaction. \n https://suiscan.xyz/mainnet/tx/${data?.tx} \n\n Not Enough Token Balance.`
                    );
                    console.log('not enough');
                  } else {
                    console.log('will swap');
  
                    const keypair0 = Ed25519Keypair.fromSecretKey(
                      address[0].key0
                    );
                    const swap = await swapCoin7k(
                      String(messageText),
                      SUI,
                      new BN(Number(data?.amount) / 2),
                      // data?.amount,
                      keypair0,
                      address[0].address0
                    );
                    if (swap) {
                      bot.sendMessage(
                        chatId,
                        `👋 Token Sell is success.\n Tracked Buy Transaction. \n https://suiscan.xyz/mainnet/tx/${data?.tx} \n\nToken Sell Transaction\n https://suiscan.xyz/mainnet/account/${address[0]?.address0}/activity`
                      );
                    }
                  }
                } else {
                  bot.sendMessage(chatId, `⚠️ Nothing Buy transaction`);
                }
              } else {
                console.log('same tx===');
              }
  
              console.log('Fetched data:', data);
            }, 25000);
          } else {
            bot.sendMessage(chatId, `⚠️ No SUI balance`);
          }
  
          // console.log('data========', data[0]);
          // if (balance(coinBalance0.totalBalance) < 20) {
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
});
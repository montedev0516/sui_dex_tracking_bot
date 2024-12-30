import { Request, Response } from 'express';
import UserInfo from '../models/models';
import userSchema from '../models/models';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { SuiClient } from '@mysten/sui/client';
import { getQuote, buildTx } from '@7kprotocol/sdk-ts';
import BN from 'bn.js';

// import { balance } from './bot';
// import { suiClient } from './bot';

export const suiClient = new SuiClient({
  url: 'https://sui.w3node.com/f5e2e0a74fa0ec3497bc62779a2c5ede4a9ae5ea58ecdecbf678347c0dae6448/api',
  // url: 'https://fullnode.mainnet.sui.io:443',
});

export const balance = (balance: any) => {
  return Number.parseInt(balance) / Number(MIST_PER_SUI);
};
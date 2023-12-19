import { Provider, Wallet, WalletUnlocked } from "fuels";

export const generateWallet = (provider: Provider) => {
  const wallet: WalletUnlocked = Wallet.generate({ provider });
  return wallet;
};

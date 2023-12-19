import { AbstractAddress, BigNumberish, WalletUnlocked } from "fuels";
import { useState } from "react";

export const useTransfer = (
  wallet: WalletUnlocked,
  address: AbstractAddress,
  amount: BigNumberish
) => {
  const transfer = async () => {
    await wallet.transfer(address, amount);
  };

  return transfer;
};

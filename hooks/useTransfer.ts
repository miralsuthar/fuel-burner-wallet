import {
  AbstractAddress,
  BigNumberish,
  WalletUnlocked,
  Address as TransferAddress,
  Provider,
  BaseAssetId,
} from "fuels";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useTransfer = (
  address: `fuel${string}`,
  amount: BigNumberish,
  walletPrivateKey: string,
  provider: Provider
) => {
  const { toast } = useToast();

  const transfer = async () => {
    const transferAddress = new TransferAddress(address as `fuel${string}`);
    const unlockedWallet = new WalletUnlocked(walletPrivateKey, provider!);
    try {
      await unlockedWallet.transfer(transferAddress, amount, BaseAssetId, {
        gasLimit: 10_000,
        gasPrice: 10_000,
      });
      toast({
        title: "ETHER Transfer successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error transfering ETHER",
        variant: "destructive",
      });
    }
  };

  return { transfer };
};

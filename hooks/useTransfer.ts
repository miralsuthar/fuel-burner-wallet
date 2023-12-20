import {
  WalletUnlocked,
  Address as TransferAddress,
  Provider,
  BaseAssetId,
  bn,
} from "fuels";
import { useToast } from "@/components/ui/use-toast";
import { currencyDecimals } from "@/lib/utils";

export const useTransfer = (
  address: `fuel${string}`,
  amount: number | string,
  walletPrivateKey: string,
  provider: Provider
) => {
  const { toast } = useToast();

  const transfer = async () => {
    const transferAddress = new TransferAddress(address as `fuel${string}`);
    const unlockedWallet = new WalletUnlocked(walletPrivateKey, provider!);
    try {
      if (!amount) {
        toast({
          title: "Amount is required",
          variant: "destructive",
        });
        return;
      }
      await unlockedWallet.transfer(
        transferAddress,
        bn(+amount * Math.pow(10, currencyDecimals)),
        BaseAssetId,
        {
          gasLimit: 10_000,
          gasPrice: 1,
        }
      );
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

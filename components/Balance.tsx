import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { WalletUnlocked } from "fuels";
import { useEffect, useState } from "react";

export const Balance = ({ wallet }: { wallet: WalletUnlocked }) => {
  const [balance, setBalance] = useState<number>();
  const [isBalanceCheck, setIsBalanceCheck] = useState(false);

  useEffect(() => {
    (async () => {
      if (isBalanceCheck) {
        const balance = await wallet?.getBalance();
        setBalance(balance?.toNumber()!);
        setIsBalanceCheck(false);
      }
    })();
  }, [wallet, isBalanceCheck]);

  return (
    <div className="flex justify-center items-center gap-3">
      <span>{balance ? balance : 0} ETH</span>
      <Button onClick={() => setIsBalanceCheck(true)}>
        <RefreshCcw size={16} />
      </Button>
    </div>
  );
};

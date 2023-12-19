import { WalletUnlocked } from "fuels";
import { Copy } from "lucide-react";

export const Address = ({ wallet }: { wallet: WalletUnlocked }) => {
  const copyAddress = async () => {
    await navigator.clipboard.writeText(
      wallet.address.toAddress().substring(4)
    );
  };

  const address = wallet.address.toString();

  return (
    <div className="flex justify-center items-center gap-4">
      <span>
        {address?.substring(0, 6)}....
        {address?.substring(address.length - 5)}
      </span>
      <Copy className="cursor-pointer" size={10} onClick={copyAddress} />
    </div>
  );
};

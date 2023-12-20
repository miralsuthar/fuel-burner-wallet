import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export const Balance = ({
  balance,
  refetch,
}: {
  balance: number;
  refetch: () => void;
}) => {
  return (
    <div className="flex justify-center items-center gap-3">
      <span>{balance} ETH</span>
      <Button onClick={refetch}>
        <RefreshCcw size={16} />
      </Button>
    </div>
  );
};

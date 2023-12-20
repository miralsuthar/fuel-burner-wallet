import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { currencyDecimals } from "@/lib/utils";

export const Balance = ({
  balance,
  refetch,
}: {
  balance: number;
  refetch: () => void;
}) => {
  return (
    <div className="flex justify-center items-center gap-3">
      <span className="text-lg">
        {(balance / Math.pow(10, currencyDecimals)).toFixed(2)} ETH
      </span>
      <Button variant={"outline"} onClick={refetch}>
        <RefreshCcw className="text-black" size={16} />
      </Button>
    </div>
  );
};

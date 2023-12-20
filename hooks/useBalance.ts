import { type AbstractAddress, Provider, BaseAssetId, Address } from "fuels";
import { useEffect, useMemo, useState } from "react";

export const useBalance = (address: `fuel${string}`, provider: Provider) => {
  const [balance, setBalance] = useState<number>(0);
  const [isRefetching, setIsRefetching] = useState(true);

  const refetch = () => {
    setIsRefetching(true);
  };

  useEffect(() => {
    if (provider && address && isRefetching) {
      const ownerAddress = new Address(address);
      (async () => {
        const balance = await provider.getBalance(ownerAddress, BaseAssetId);
        setBalance(balance?.toNumber());
      })();
      setIsRefetching(false);
    }
  }, [address, provider, isRefetching]);

  return { balance, refetch };
};

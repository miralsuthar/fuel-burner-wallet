import { Inter } from "next/font/google";
import { generateWallet } from "@/utils";
import { useContext, useState } from "react";
import { FuelContext } from "./_app";
import { BaseAssetId, WalletUnlocked, Address as TrasnferAddress } from "fuels";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Balance } from "@/components/Balance";
import { Address } from "@/components/Address";
import { Input } from "@/components/ui/input";
import QrReader from "react-qr-reader-es6";
import { useLocalStorage } from "usehooks-ts";
import { useBalance } from "@/hooks/useBalance";

const inter = Inter({ subsets: ["latin"] });

// type wallet = {
//   address: string;
//   provider: {
//     operations: {};
//     options: {};
//     url: string;
//   };
// };

export default function Home() {
  const { provider } = useContext(FuelContext);
  const [wallet, setWallet] = useLocalStorage("wallet", {} as WalletUnlocked);
  const [walletPrivateKey, setWalletPrivateKey] = useLocalStorage(
    "walletPrivateKey",
    ""
  );

  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<any>();

  const { balance, refetch } = useBalance(
    wallet?.address?.toString() as `fuel${string}`,
    provider!
  );

  const [isScanning, setIsScanning] = useState(false);

  const transfer = async () => {
    const transferAddress = new TrasnferAddress(address as `fuel${string}`);
    // await wallet?.transfer(transferAddress, amount, BaseAssetId, {
    //   gasLimit: 10_000,
    //   gasPrice: 10_000,
    // });
    const unlockedWallet = new WalletUnlocked(walletPrivateKey, provider!);
    await unlockedWallet.transfer(transferAddress, amount, BaseAssetId, {
      gasLimit: 10_000,
      gasPrice: 10_000,
    });
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-10 ${inter.className}`}
    >
      {wallet ? (
        <>
          <Address address={wallet.address?.toString()} />
          <Balance balance={balance} refetch={() => refetch()} />
          <QRCodeSVG
            className="w-9/12 h-80"
            value={wallet?.address?.toString()}
          />

          {isScanning && (
            <div className="absolute top-0 left-0">
              <QrReader
                delay={300}
                onError={(e) => {
                  console.log(e);
                }}
                onScan={(e) => {
                  if (e !== null) {
                    setAddress(e);
                    setIsScanning(false);
                  }
                }}
                style={{ width: "60%" }}
              />
            </div>
          )}
          <Button onClick={() => setIsScanning(true)}>Scan</Button>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={transfer}>Trasnfer</Button>
          </div>
        </>
      ) : (
        <Button
          onClick={() => {
            const wallet = generateWallet(provider!);
            setWalletPrivateKey(wallet.privateKey);
            setWallet(wallet);
          }}
          className="btn"
        >
          Generate
        </Button>
      )}
    </main>
  );
}

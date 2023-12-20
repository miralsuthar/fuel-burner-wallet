import { Inter } from "next/font/google";
import { generateWallet } from "@/utils";
import { useContext, useEffect, useState } from "react";
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

  const [svgAddress, setSvgAddress] = useState<string>("");

  useEffect(() => {
    setSvgAddress(wallet.address.toString());
  }, [wallet]);

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
      className={`flex min-h-screen relative flex-col items-center justify-center gap-10 ${inter.className}`}
    >
      {wallet ? (
        <>
          <Address address={wallet.address?.toString()} />
          <Balance balance={balance} refetch={() => refetch()} />

          <QRCodeSVG className="w-9/12 h-80" value={svgAddress} />

          {isScanning && (
            <>
              <div className="h-screen w-screen absolute top-0 left-0 backdrop-blur-md">
                <div className="w-6/12 flex flex-col justify-center items-center gap-4 h-2/4 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 absolute">
                  <QrReader
                    onError={(e) => {
                      console.log(e);
                    }}
                    onScan={(e) => {
                      if (e !== null) {
                        setAddress(e);
                        setIsScanning(false);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                  <Button onClick={() => setIsScanning(false)}>Stop</Button>
                </div>
              </div>
            </>
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

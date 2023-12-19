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

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { provider } = useContext(FuelContext);
  const [wallet, setWallet] = useState<WalletUnlocked>();

  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<any>();

  const [isScanning, setIsScanning] = useState(false);

  const transfer = async () => {
    const transferAddress = new TrasnferAddress(`fuel${address}`);
    await wallet?.transfer(transferAddress, amount, BaseAssetId, {
      gasLimit: 10_000,
      gasPrice: 10_000,
    });
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-10 ${inter.className}`}
    >
      {wallet && <Address wallet={wallet} />}
      {wallet && <Balance wallet={wallet} />}
      {wallet && (
        <QRCodeSVG
          className="w-9/12 h-80"
          value={wallet?.address.toAddress().substring(4)}
        />
      )}
      <Button
        onClick={() => {
          const wallet = generateWallet(provider!);
          setWallet(wallet);
          window.localStorage.setItem("wallet", JSON.stringify(wallet));
        }}
        className="btn"
      >
        Generate
      </Button>
      {wallet && isScanning && (
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
      )}
      {wallet && <Button onClick={() => setIsScanning(true)}>Scan</Button>}
      {wallet && (
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
      )}
    </main>
  );
}

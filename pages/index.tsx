import { Inter } from 'next/font/google';
import { generateWallet } from '@/utils';
import { useContext, useEffect, useState } from 'react';
import { FuelContext } from './_app';
import { WalletUnlocked } from 'fuels';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Balance } from '@/components/Balance';
import { Address } from '@/components/Address';
import { Input } from '@/components/ui/input';
import QrReader from 'react-qr-reader-es6';
import { useLocalStorage } from 'usehooks-ts';
import { useBalance } from '@/hooks/useBalance';
import { useTransfer } from '@/hooks/useTransfer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { projectUrl } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { provider } = useContext(FuelContext);
  const [wallet, setWallet] = useLocalStorage<WalletUnlocked | null>(
    'wallet',
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [walletPrivateKey, setWalletPrivateKey] = useLocalStorage(
    'walletPrivateKey',
    ''
  );

  const [svgAddress, setSvgAddress] = useState<string>('');

  useEffect(() => {
    if (window !== undefined) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      setSvgAddress(wallet.address.toString());
    }
  }, [wallet]);

  const router = useRouter();
  const { address: queryAddress } = router.query;

  useEffect(() => {
    if (queryAddress) {
      setAddress(queryAddress as string);
    }
  }, [queryAddress]);

  const [address, setAddress] = useState<string>(
    (queryAddress as string) || ''
  );
  const [amount, setAmount] = useState<number | string>();

  const { balance, refetch } = useBalance(
    wallet?.address?.toString() as `fuel${string}`,
    provider!
  );
  const { transfer } = useTransfer(
    address as `fuel${string}`,
    amount as number | string,
    walletPrivateKey,
    provider!
  );

  const [isScanning, setIsScanning] = useState(false);

  return (
    <main
      className={`min-h-screen overflow-hidden relative text-white bg-black py-24 ${inter.className}`}
    >
      <div className='w-full z-0 md:left-[40%] top-1/4 h-1/3 md:w-2/12 md:h-1/3 absolute opacity-60 rounded-full blur-3xl bg-[#00F58B] animate-spinner '></div>
      <div className='flex z-10 relative flex-col items-center justify-center gap-10'>
        <h1 className='text-3xl font-bold text-[#00F58B]'>Funk Wallet</h1>

        <span>A burner Fuel wallet stored inside of your browser.</span>
        {isLoaded && wallet ? (
          <>
            <Address address={wallet.address?.toString()} />
            <Balance balance={balance} refetch={() => refetch()} />
            {balance <= 0 && (
              <Link
                className='underline text-gray-400'
                href={`https://faucet-beta-4.fuel.network/?address=${wallet.address.toString()}`}
              >
                Get some funds from the faucet
              </Link>
            )}
            <div className='w-max h-80 relative'>
              <Image
                src='/fuel-logo.png'
                className='absolute border-[10px] border-white top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4'
                alt='logo'
                width={70}
                height={70}
              />
              <QRCodeSVG
                className='w-full h-full border-[5px] border-white rounded-md'
                value={`${projectUrl}?address=${svgAddress}`}
              />
            </div>

            {isScanning && (
              <>
                <div className='h-screen w-screen absolute top-0 left-0 backdrop-blur-md'>
                  <div className='w-full md:w-6/12 flex flex-col justify-center items-center gap-4 h-2/4 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 absolute'>
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
                      style={{ width: '100%' }}
                    />
                    <Button onClick={() => setIsScanning(false)}>Stop</Button>
                  </div>
                </div>
              </>
            )}
            <Button variant={'destructive'} onClick={() => setIsScanning(true)}>
              Scan
            </Button>
            <div className='flex flex-col text-black gap-4'>
              <Input
                placeholder='address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                placeholder='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button variant={'outline'} onClick={() => transfer()}>
                Transfer
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant={'outline'}
            onClick={() => {
              const wallet = generateWallet(provider!);
              setWalletPrivateKey(wallet.privateKey);
              setWallet(wallet);
            }}
            className='text-black'
          >
            Generate
          </Button>
        )}

        <span className='mt-8'>
          Made by{' '}
          <a
            href='https://twitter.com/miral182000'
            target='_blank'
            className='underline'
          >
            Miral Suthar
          </a>
        </span>

        <a
          href='https://github.com/miralsuthar/fuel-burner-wallet/'
          target='_blank'
          className='underline'
        >
          GitHub
        </a>
      </div>
    </main>
  );
}

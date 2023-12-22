import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';

export const Address = ({ address }: { address: string }) => {
  const { toast } = useToast();

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    toast({
      title: 'Address copied.',
      variant: 'default',
    });
  };

  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      setIsLoad(true);
    }
  }, []);

  return (
    <div className='flex justify-center items-center gap-4'>
      {isLoad && (
        <p>
          <span>{address?.substring(0, 6)}....</span>
          <span>{address?.substring(address.length - 5)}</span>
        </p>
      )}
      <Copy className='cursor-pointer' size={10} onClick={copyAddress} />
    </div>
  );
};

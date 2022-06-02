import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { getFromStorage } from '../../helpers/localstorage';
import { getWithToken, postWithToken } from '../../helpers/axios';
import QRCode from 'react-qr-code';
import BodyWrap from '../../components/BodyWrap';

export default function Receive() {
    const [address, setAddress] = useState<string>('');
    const [amountInSats, setAmountInSats] = useState<number>(0);
    const [invoice, setInvoice] = useState<string>('');
    const [platform, setPlatform] = useState<string>('bitcoin');

    const getAddresses = useCallback(async () => {
        const token = await getFromStorage('token');

        if (token) {
            const addressReq = await getWithToken(`user/address`, token);
            setAddress(addressReq.data.data);
        }
    }, [platform]);

    useEffect(() => {
        getAddresses();
    }, [getAddresses]);

    const switchPlatforms = useCallback((_type: string) => {
        setPlatform(_type);
        getAddresses();
    }, [getAddresses]);

    const changeData = useCallback((e: ChangeEvent<any>) => {
        console.log('value ===', e.target.value)
        setAmountInSats(Number(e.target.value))
    }, []);

    const createInvoice = useCallback(async () => {
        const token = await getFromStorage('token');
        if (!amountInSats) {
            return alert(`Enter an amount other than 0 ${amountInSats}`);
        } else {
            console.log('Sending')
            const data = {
                sats: amountInSats
            };
            const invoiceReq = await postWithToken('lightning/invoice', data, token);
            setInvoice(invoiceReq.data.data.invoice);
        }

    }, [amountInSats]);

    return (
        <BodyWrap>
            <div>
                <main className="flex-1">
                    <div className="">
                        <div className="max-w-7xl mx-auto">
                            <section className="mt-3 mb-2">
                                <button className={`inline justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  ${platform === 'bitcoin' ? 'bg-black text-white' : 'text-gray-700'} focus:outline-none`}
                                    onClick={() => switchPlatforms('bitcoin')
                                    }>
                                    Bitcoin
                                </button>
                                <button className={`inline justify-center lg:ml-5 sm:ml-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${platform === 'lightning' ? 'bg-black text-white' : 'text-gray-700'} focus:outline-none`} onClick={() => switchPlatforms('lightning')}>
                                    Lightning
                                </button>
                            </section>
                            <div className="py-4 flex align-center justify-center">
                                <div className="w-full" style={{ maxWidth: 800 }}>
                                    <div className="mt-5 md:mt-0 md:col-span-2 w-full">
                                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                {platform === 'bitcoin' ? (
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <label
                                                                htmlFor="company-website"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                Receive bitcoin to...
                                                            </label>
                                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                                <input
                                                                    readOnly
                                                                    type="text"
                                                                    name="company-website"
                                                                    id="company-website"
                                                                    className="flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                                                    placeholder="bc123dfadfknadifojaodnfa"
                                                                    value={address}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex justify-center">
                                                                <QRCode
                                                                    fgColor="#053140"
                                                                    bgColor="#f3f4f6"
                                                                    value={address ? address : 'No address'}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <label
                                                                htmlFor="company-website"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                Amount in sats
                                                            </label>
                                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                                <input
                                                                    type="number"
                                                                    name="amountInSats"
                                                                    id="amountInSats"
                                                                    className="flex-1 block w-full rounded-md sm:text-sm border-2 border-gray-300 py-2 px-4 h-9"
                                                                    placeholder="Set amount in sats"
                                                                    value={amountInSats}
                                                                    onChange={changeData}
                                                                />
                                                                <button
                                                                    className="bg-white inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 :outline-none focus:ring-2 focus:ring-offset-2 h-10"
                                                                    onClick={createInvoice}
                                                                >
                                                                    Create invoice
                                                                </button>
                                                            </div>
                                                            <label
                                                                htmlFor="company-website"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                Receive lightning payment...
                                                            </label>
                                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                                <textarea
                                                                    readOnly
                                                                    name="invoice"
                                                                    id="invoice"
                                                                    rows={5}
                                                                    className="flex-1 block w-full rounded-md sm:text-sm border-2 border-gray-300 p-3"
                                                                    placeholder="bc123dfadfknadifojaodnfa"
                                                                    value={invoice}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex justify-center">
                                                                <QRCode
                                                                    fgColor="#053140"
                                                                    bgColor="#f3f4f6"
                                                                    value={invoice ? invoice : 'No invoice'}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                }
                                            </div>
                                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            platform === 'bitcoin' ? address : invoice 
                                                        )
                                                    }
                                                    className="bg-white inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 :outline-none focus:ring-2 focus:ring-offset-2"
                                                >
                                                    Copy {platform === 'bitcoin' ? 'address' : 'invoice'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </BodyWrap>
    );
}

import { useEffect, useState } from 'react';
import BodyWrap from '../../components/BodyWrap';

import CreateTxForm from './components/CreateTxForm';

import { postWithToken, getWithToken } from '../../helpers/axios';
import { getFromStorage } from '../../helpers/localstorage';
import TransactionSummary from './components/TransactionSummary';

export default function Send() {
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string>('');
    const [txId, setTxID] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
    }, []);

    const createTransactionWithFormValues = async (
        recipientAddress: string,
        invoice: string,
        amountToSend: number,
        type: string,
    ) => {
        const token = await getFromStorage('token');
        try {
            if (token) {
                if (type === 'lightning') {
                    const body = {
                        invoice
                    };

                    const res = await postWithToken(`lightning/pay`, body, token);
                    if (res.status == 200) {
                        setTxID(res.data.data.invoice);
                        setStep(1);
                    }
                } else {
                    const body = {
                        recipient: recipientAddress,
                        amount: Number(amountToSend)
                    }
                    const res = await postWithToken(`wallet/createtransaction`, body, token);
                    if (res.status == 200) {
                        setTxID(res.data.data.txid);
                        setStep(1);
                    }
                }
            }
        } catch (e) {
            setError((e as Error).message);
        }
    };
    return (
        <BodyWrap>
            <div>
                <main className="flex-1">
                    <div className="">
                        <div className="max-w-7xl mx-auto">
                            {step === 0 && (
                                <CreateTxForm
                                    error={error}
                                    createTransaction={createTransactionWithFormValues}
                                />
                            )}
                            {step === 1 && (
                                <TransactionSummary
                                    setStep={setStep}
                                    txId={txId}
                                    status={status}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </BodyWrap>
    );
}
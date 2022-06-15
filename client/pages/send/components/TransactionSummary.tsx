import { Dispatch, SetStateAction, useState } from 'react';
import {
    ArrowLeftIcon
} from "@heroicons/react/outline";

import TransactionSuccessAlert from './TransactionSuccessAlert';

interface Props {
    txId: string;
    status: string;
    setStep: Dispatch<SetStateAction<number>>
}

const TransactionSummary = ({ status, txId, setStep }: Props) => {
    const [btnDis, setBtnDis] = useState(false);

    return (
        <div className="mt-10 lg:mt-0">
             <ArrowLeftIcon className="h-8 w-8 mb-2 text-gray-500 cursor-pointer" aria-hidden="true" onClick={() => setStep(0)} />

            <h2 className="text-lg font-medium text-gray-900">Transaction summary</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                {status === 'success' ? <TransactionSuccessAlert txid={txId} /> : null}
                <h3 className="mt-3 mb-3 text-lg text-gray-500">Transaction : {txId}</h3>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                        type="submit"
                        disabled={btnDis}
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                        onClick={() => setStep(0)}
                    >
                       Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionSummary;

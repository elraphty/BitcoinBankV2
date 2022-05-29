import { AddInvoiceResponse } from '@radar/lnrpc';
import lndClient from '../config/lnd';
import { TransactionLogs, UserBalance } from '../interfaces/db';
import knex from '../db';
import { emitSocketEvent } from '../config/socket';

export const createInvoice = async (
    amount: number = 0
): Promise<AddInvoiceResponse> => {
    const rpc = await lndClient;

    const invoice = await rpc.addInvoice({
        value: amount.toString(),

    });

    return invoice;
};

export const subscribeToInvoice = async (invoice: AddInvoiceResponse, btcValue: number, userid: number) => {
    const rpc = await lndClient;

    // Add Lightning payment to user's transaction logs
    insertTransaction(btcValue, invoice.paymentRequest, 0, 'receive', userid);

    // Subscribe to invoice
    const subscribe = await rpc.subscribeInvoices({
        addIndex: invoice.addIndex,
    });

    subscribe.on('data', async (response) => {
        const paymentValue = Number(response.value);

        // Convert satoshis to BTC
        const btcValue = paymentValue / 100000000;

        // Check if transaction has been settled
        if (response.settled) {
            // Get the lightning invoice;
            const transactions: TransactionLogs[] = await knex<TransactionLogs>(
                'transactionlogs'
            ).where({ txid: invoice.paymentRequest });
            
            const transaction = transactions[0];
            const tuserId = transaction.userid;

            if (Number(transaction.status) !== 1) {
                await knex<TransactionLogs>('transactionlogs').update({ status: 1 }).where({ userid: tuserId, txid: invoice.paymentRequest })

                updateBalance(tuserId, btcValue, 'settled');
            }
        }
    });

};

const insertTransaction = async (
    amount: number,
    lninvoice: string,
    status: number,
    type: string,
    userid: number
) => {
    await knex<TransactionLogs>('transactionlogs').insert({
        amount,
        txid: lninvoice,
        status,
        network: 'lightning',
        type,
        userid
    });
};

const updateBalance = async (
    userid: number | undefined,
    amount: number,
    status: string,
) => {
    try {
        // Update the User's Balance with the transaction amount if the invoice is settled
        if (status === 'settled') {
            await knex<UserBalance>('usersbalance')
                .update({ amount: knex.raw(`amount + ${amount}`) })
                .where({ userid });

            // Send payment success event
            // emitSocketEvent.emit('paymentsuccess', amount);
        } else {
            // Send payment failure event
            // emitSocketEvent.emit('paymentfailure', amount);
        }
    } catch (err) {
        // Log Error
        console.log('Update Balance Error ===', (err as Error).message);
    }
};

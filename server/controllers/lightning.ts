import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { TransactionLogs, UserBalance } from '../interfaces/db';
import { RequestUser } from '../interfaces';
import { createInvoice, subscribeToInvoice, invoiceLookup, getFeeReport, payInvoice, decodeInvoice } from '../helpers/paymentHelper';
import { FeeReportResponse } from '@radar/lnrpc';

// Create a lightning invoice
export const addInvoice = async (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const reqUser = req as RequestUser;
        const userId = Number(reqUser.user.id);

        const amount: number = Number(req.body.sats);

        // Convert to Bitcoin
        const bitcoinAmount = amount / 100000000;

        createInvoice(amount)
            .then(async (invoice) => {
                // Subscribe tp invoice
                subscribeToInvoice(invoice, bitcoinAmount, userId);

                const txid: string = invoice.paymentRequest;

                responseSuccess(res, 200, 'Successfully created invoice', { txid });
            })
            .catch((e) => {
                return responseError(res, 403, 'Could not create invoice');
            });
    } catch (err) {
        next(err);
    }
}

// List all Lightning inovices
export const listInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const reqUser = req as RequestUser;
        const userid = Number(reqUser.user.id);

        const listTransactions: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ userid, network: 'lightning' });

        responseSuccess(res, 200, 'Successfully listed lightning payments', listTransactions);

    } catch (err) {
        next(err);
    }
}

// Lookup Lightning inovice
export const lookupInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const invoice: string = req.body.invoice;

        const lookup = await invoiceLookup(invoice);

        responseSuccess(res, 200, 'Successfully lookup invoice', lookup);

    } catch (err) {
        next(err);
    }
}

// Pay invoice
export const payUserInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const reqUser = req as RequestUser;
        const userid = Number(reqUser.user.id);

        const invoice: string = req.body.invoice;

        const decodedInvoice = await decodeInvoice(invoice);

        const amount = Number(decodedInvoice.numSatoshis);
        const amountInBtc = amount / 100000000;

        const userBalance: UserBalance[] = await knex<UserBalance>('usersbalance').where({ userid });

        const balance = Number(userBalance[0].amount);

        const feeReport: FeeReportResponse = await getFeeReport();

        const feeRate = feeReport.channelFees[0].feeRate;

        const total = balance + feeRate;

        if (amountInBtc >= total) {
            return responseError(res, 403, 'Top up your balance');
        }

        const invoicePaid = await payInvoice(invoice);

        if (invoicePaid) {
            // insert in transaction logs
            await knex<TransactionLogs>('transactionlogs').insert({
                amount: amountInBtc,
                txid: invoice,
                status: 1,
                network: 'lightning',
                type: 'send',
                userid
            });

            // Update user balance
            await knex<UserBalance>('usersbalance')
                .update({ amount: knex.raw(`amount - ${amountInBtc}`) })
                .where({ userid });

            return responseSuccess(res, 200, 'Successfully paid invoice', {});
        } else {
            return responseError(res, 502, 'Could not pay invoice');
        }

    } catch (err) {
        next(err);
    }
}
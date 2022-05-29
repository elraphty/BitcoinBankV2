import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { TransactionLogs, UserBalance } from '../interfaces/db';
import { RequestUser } from '../interfaces';
import axios from 'axios';
import { createInvoice, subscribeToInvoice } from '../helpers/paymentHelper';

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

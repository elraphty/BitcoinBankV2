import { body } from 'express-validator';

const myWhitelist: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#@.';

export const create = [
    body('sats')
        .not().isEmpty()
        .isNumeric()
        .ltrim()
        .rtrim()
        .whitelist(myWhitelist)
        .escape()
        .withMessage('Provide the amount of sats'),
]

export const lookup = [
    body('invoice')
        .not().isEmpty()
        .isString()
        .ltrim()
        .rtrim()
        .whitelist(myWhitelist)
        .escape()
        .withMessage('Provide the invoice'),
]
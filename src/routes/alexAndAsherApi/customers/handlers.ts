import stripe from '../../../plugins/stripe';

import { SERVER_RESPONSE_CODES } from '../../../utils/constants';
import { Request, Response } from '../../../plugins/express';

/**
 * @function updateUserPaymentInformation
 * @param req
 * @member req.body - Information to create a new payment within stripe
 * @returns - A boolean to indicate the payment method was updated
 */
export const updateUserPaymentInformation = (req: Request, res: Response) => {
  try {

    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ created: true }).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    res.status(errorObj.status).send({ error: errorObj.message }).end
  }
}
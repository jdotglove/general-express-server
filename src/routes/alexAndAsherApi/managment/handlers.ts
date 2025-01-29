import Stripe from 'stripe';
import { v4 as uuidv4 } from "uuid";

import { SERVER_RESPONSE_CODES } from '../../../utils/constants';
import { Request, Response } from '../../../plugins/express';
import { createOneCustomer, findOneCustomer } from '../../../db/alex-and-asher/services/customer';
import { createOnePaymentUpdateRequest } from '../../../db/alex-and-asher/services/payment-update-request';
import { AlexAndAsherError } from '../../../utils/errors';

/**
 * @function fetchStripeCustomers
 * @param req
 * @member req.query.limit how many customers to pull per page
 * @member req.query.skip which page of customers to pull
 * @returns - a list of customers from the stripe account
 */
export const fetchStripeCustomers = async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_KEY as string);
  
  try {
    const customers = await stripe.customers.list({ limit: 10 });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ customers: customers.data }).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    };
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
}

/**
 * @function createUpdatePaymentRequest
 * @param req 
 * @member req.body - contains info for createing customer and/or update payment request
 * @returns 
 */
export const createUpdatePaymentRequest = async (req: Request, res: Response) => {
  try {
    if (!req.body.stripeId) {
      throw new AlexAndAsherError("Missing StripeId", SERVER_RESPONSE_CODES.BAD_PAYLOAD);
    }

    let targetCustomer;

    targetCustomer = await findOneCustomer({
      stripeId: req.body.stripeId,
    });

    if (!targetCustomer?._id) {
      targetCustomer = await createOneCustomer({
        createdAt: new Date(),
        email: req.body.email,
        name: req.body.name,
        stripeId: req.body.stripeId,
        updateAt: new Date(),
      });
    }

    if (targetCustomer?._id) {
      const uniqueId = uuidv4();

      const createdPaymentUpdateRequest = await createOnePaymentUpdateRequest({
        customerId: targetCustomer._id,
        updateAuthToken: uniqueId,
        expired: false,
      });
      res.status(SERVER_RESPONSE_CODES.CREATED).send({ paymentUpdateRequest: createdPaymentUpdateRequest }).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.reponse.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    }
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
}
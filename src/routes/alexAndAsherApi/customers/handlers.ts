import mongoose from 'mongoose';

import stripe from '../../../plugins/stripe';
import { Request, Response } from '../../../plugins/express';
import { findOnePaymentUpdateRequest } from "../../../db/alex-and-asher/services/payment-update-request";
import { AlexAndAsherError, SERVER_RESPONSE_CODES } from "../../../utils/errors";
import { findOneCustomer } from "../../../db/alex-and-asher/services/customer";


/**
 * @function updateUserPaymentInformation
 * @param req
 * @member req.params.customerId - Id of customer to update,
 * @member req.body.paymentMethod - payment method to add to customer,
 * @returns - A boolean to indicate the payment method was updated
 */
export const updateUserPaymentInformation = async (req: Request, res: Response) => {
  try {
    if (!req.params.customerId) {
      throw new AlexAndAsherError("Missing customer id", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    if (!req.body.paymentMethod?.id) {
      throw new AlexAndAsherError("Missing payment method id", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundCustomer = await findOneCustomer({
      _id: new mongoose.Types.ObjectId(req.params.customerId),
    });

    if (!foundCustomer._id) {
      throw new AlexAndAsherError(`Cannot find customer with id ${req.params.customerId} `, SERVER_RESPONSE_CODES.NOT_FOUND);
    }

    const paymentMethod = await stripe.paymentMethods.attach(req.body.paymentMethod.id, {
      customer: foundCustomer.stripeId, // Replace with the actual customer stripe ID
    });

    
    // Set the default payment method for future payments
    await stripe.customers.update(foundCustomer.stripeId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ updated: true }).end();
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

/**
 * @function verifyUpdateAuthToken
 * @param req
 * @member req.query.token auth token to verify for update payment request
 * @member req.query.email email address to verify for update payment request
 */
export const verifyUpdateAuthToken = async (req: Request, res: Response) => {
  try {
    if (!req.query.token) {
      throw new AlexAndAsherError("Missing Update Auth Token", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    if (!req.query.email) {
      throw new AlexAndAsherError("Missing Verification Email", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundCustomer = await findOneCustomer({
      email: req.query.email,
    });

    if (!foundCustomer?._id) {
      throw new AlexAndAsherError("Email address not verified", SERVER_RESPONSE_CODES.NOT_FOUND);
    }

    const foundRequest = await findOnePaymentUpdateRequest({
      updateAuthToken: req.query.token,
      customerId: foundCustomer._id,
    });

    if (!foundRequest._id) {
      throw new AlexAndAsherError("Update request cannot be verified", SERVER_RESPONSE_CODES.NOT_FOUND);
    }

    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ verifiedCustomer: foundRequest.customerId }).end();
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
import { SERVER_RESPONSE_CODES } from "../../../utils/constants";
import { Request, Response } from "../../../plugins/express";
import { findOnePaymentUpdateRequest } from "../../../db/alex-and-asher/services/payment-update-request";
import { AlexAndAsherError } from "../../../utils/errors";
import { findOneCustomer } from "../../../db/alex-and-asher/services/customer";

/**
 * @function verifyUpdateAuthToken
 * @param req
 * @member req.query.token auth token to verify for update payment request
 * @member req.query.email email address to verify for update payment request
 */
export const verifyUpdateAuthToken = async (req: Request, res: Response) => {
  try {
    if (!req.query.token) {
      throw new AlexAndAsherError("Missing Update Auth Token", SERVER_RESPONSE_CODES.BAD_PAYLOAD);
    }

    if (!req.query.email) {
      throw new AlexAndAsherError("Missing Verification Email", SERVER_RESPONSE_CODES.BAD_PAYLOAD);
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
    
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ verified: true }).end();
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
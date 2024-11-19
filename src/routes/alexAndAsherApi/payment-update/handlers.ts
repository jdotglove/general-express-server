import { SERVER_RESPONSE_CODES } from "../../../utils/constants";
import { Request, Response } from "../../../plugins/express";
import { findOnePaymentUpdateRequest } from "../../../db/alex-and-asher/services/payment-update-request";

/**
 * @function verifyUpdateAuthToken
 * @param req
 * @member req.params.updateAuthToken auth toekn to verify for update payment request
 */
export const verifyUpdateAuthToken = async (req: Request, res: Response) => {
  try {
    const foundRequest = await findOnePaymentUpdateRequest({
      updateAuthToken: req.params.updateAuthToken
    });
    console.log(foundRequest);
    
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
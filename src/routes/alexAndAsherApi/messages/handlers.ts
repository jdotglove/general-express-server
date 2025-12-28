import { Request, Response } from "../../../plugins/express";
import { SERVER_RESPONSE_CODES } from "../../../utils/errors";
import twilio from "twilio";

export const processIncomingMessage = async (req: Request, res: Response) => {
  try {
    const twiml = new twilio.twiml.MessagingResponse();

    res.type('text/xml').send(twiml.toString()).end();
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
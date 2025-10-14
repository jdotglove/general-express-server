import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

import { Request, Response } from "../../../plugins/express";
import { SERVER_RESPONSE_CODES } from "../../../utils/constants";
import { NestError } from "../../../utils/errors";
import { createUser, findOneUser } from "../../../db/nest/services/user";
import { createSession } from "../../../db/nest/services/session";

const saltRounds = parseInt(`${process.env.SALT_ROUNDS}`);

/**
 * @function adminLogin
 * @param req
 * @member body.username - Message to use for access to knowledge
 * @member body.password - Message to use for access to knowledge
 */
export const adminLogin = async (req: Request, res: Response) => {
  let payload, statusCode;
  try {
    if (!req.body.username || !req.body.password) {
      throw new NestError("Username and password are required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundUser = await findOneUser({
      username: req.body.username,
    });

    const bcryptMatch = await bcrypt.compare(req.body.password, foundUser?.password);
    const createdAtDate = dayjs();
  console.log(bcryptMatch, req.body.password, foundUser?.password)
    if (foundUser && bcryptMatch) {
      const token = jwt.sign({
        createdAt: createdAtDate,
        userId: foundUser._id,
      }, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: "2 hours",
      });

      const newUserSession = await createSession({
        createdAt: createdAtDate.toDate(),
        expiresAt: createdAtDate.add(300, "hour").toDate(),
        token,
        updatedAt: createdAtDate.toDate(),
        user: foundUser._id,
      });

      statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
      payload = {
        success: true,
        session: newUserSession,
      }
    } else {
      throw new NestError("Either password or username is incorrect", SERVER_RESPONSE_CODES.NOT_FOUND);
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: error.statusCode || SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    };
    statusCode = errorObj.status;
    payload = { message: errorObj.message };
    console.error(`Error logging in admin: ${JSON.stringify(errorObj)}`);
  } finally {
    res.status(statusCode).send(payload).end();
  }
}

/**
 * @function createAdmin
 * @param req
 * @member body.username - Message to use for access to knowledge
 * @member body.password - Message to use for access to knowledge
 */
export const createAdmin = async (req: Request, res: Response) => {
  let payload, statusCode;
  try {
    if (!req.body.username || !req.body.password) {
      throw new NestError("Username and password are required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const createdAtDate = new Date();
    if (typeof saltRounds === "number") {
      bcrypt.hash(req.body.password, saltRounds).then(async function (hash) {
        await createUser({
          username: req.body.username,
          password: hash,
          createdAt: new Date(createdAtDate),
        });
      });
    }

    statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
    payload = {
      success: true,
    }
    
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: error.statusCode || SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    };
    statusCode = errorObj.status;
    payload = { message: errorObj.message };
    console.error(`Error creating admin: ${JSON.stringify(errorObj)}`);
  } finally {
    res.status(statusCode).send(payload).end();
  }
}
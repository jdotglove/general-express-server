import { Request, Response } from "../plugins/express";

export function secured(req: Request, res: Response, next: any) {
  let auth = req.headers.authorization?.split(" ");

  switch (req.path) {
    default:
      if (auth && auth[0] === "Bearer" && auth[1] === process.env.API_KEY) {
        next();
      } else {
        auth = (req.headers.Authorization as string)?.split(" ");
        if (auth && auth[0] === "Bearer" && auth[1] === process.env.API_KEY) {
          next();
        } else {
          res.status(401).send('Access forbidden').end();
        }
      }
      break;
  }

  
};
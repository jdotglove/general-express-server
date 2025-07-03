export function secured(req: any, res: any, next: any) {
  let auth = req.headers.authorization?.split(" ");

  if (auth && auth[0] === "Bearer" && auth[1] === process.env.API_KEY) {
    next();
  } else {
    auth = req.headers.Authorization?.split(" ");
    if (auth && auth[0] === "Bearer" && auth[1] === process.env.API_KEY) {
      next();
    } else {
      res.status(401).send('Access forbidden').end();
    }
  }
};
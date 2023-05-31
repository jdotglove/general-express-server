export function secured(req: any, res: any, next: any) {
  const auth = req.headers.authorization;

  if (auth === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Access forbidden').end();
  }
};
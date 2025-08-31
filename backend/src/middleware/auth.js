
import auth from 'basic-auth';

export const requireBasicAuthIfConfigured = (req, res, next) => {
  const user = process.env.BASIC_USER;
  const pass = process.env.BASIC_PASS;
  const method = req.method.toUpperCase();
  const isWrite = ['POST','PUT','PATCH','DELETE'].includes(method);

  if (!isWrite || !user || !pass) return next();

  const creds = auth(req);
  if (!creds || creds.name !== user || creds.pass !== pass) {
    res.set('WWW-Authenticate', 'Basic realm="write-ops"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
};

export function hostCheck(req, res, next) {
  const allowedHost =
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_HOST_PROD
      : process.env.ALLOWED_HOST_DEV;

  if (req.headers.host !== allowedHost) {
    return res.status(403).json({ error: "Forbidden: Invalid Host" });
  }
  next();
}

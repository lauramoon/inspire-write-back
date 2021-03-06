"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to check if user logged in
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to check if user is admin
 *
 * If not logged in, raise Unauthorized.
 *
 * If logged in but not admin, raise Forbidden.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    if (!res.locals.user.isAdmin) {
      throw new ForbiddenError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to check if user is either admin
 * or the user whose data is being accessed/changed
 *
 * If not logged in, raise Unauthorized.
 *
 * If logged in but not qualified, raise Forbidden.
 */

function ensureAdminOrSelf(req, res, next) {
  try {
    //user must be logged in
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    //user must be either admin or user being accessed
    const username = res.locals.user.username;
    const isAdmin = res.locals.user.isAdmin;
    if (!isAdmin && username != req.params.username) {
      throw new ForbiddenError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrSelf,
};

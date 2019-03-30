const createError = (message, status, code) => {
  let err = new Error(message);
  err.status = status;
  err.code = code
  return err;
}

const serverError = (error) => { return { error, status: 500, code: "server-error" } }

module.exports = {
  createError,
  serverError,
}
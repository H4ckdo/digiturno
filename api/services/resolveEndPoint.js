module.exports = (req, responseCases = {}) => {
  const endpoint = req.originalUrl;
  return Object.assign({
    success: {
      beforeResponse: (partialData, next) => {
        partialData.endpoint = endpoint;
        next();
      }
    },
    errors: {
      notFound: { endpoint },
      conflict: { endpoint },
      notAllow: { endpoint },
      forbidden: { endpoint },
      badRequest: { endpoint },
      serverError: { endpoint }
    }
  }, responseCases)
}//end resolveEndPoint
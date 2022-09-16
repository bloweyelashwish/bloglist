const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('method: ', request.method);
    logger.info('path: ', request.path);
    logger.info('body: ', request.body);
    logger.info('---');
    next();
}

const tokenExtractor = (request) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }
    next(error);
}

module.exports = {
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    errorHandler
}
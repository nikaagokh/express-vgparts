
export const ErrorHandler = (err, req, res, next) => {
    const {message, status} = err;
    res.status(status).json(message);
}
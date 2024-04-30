const CustomError = require("../errors/custom-errors");

const apiHandler = (controller) => {
    const afterContoller = async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (e) {
            if (e instanceof CustomError) {
                let message = {
                    "message": e.message,
                    "statusCode": e.httpStatusCode
                };
                next(message)
            } else {
                console.log(e);
                next(e);
            }
        }
    };
    return afterContoller;
};

module.exports = apiHandler;

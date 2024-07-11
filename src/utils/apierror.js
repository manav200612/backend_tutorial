import { Error } from "mongoose";

class Apierror extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        data = null,
        error = [],
        stack = "",
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;
        this.stack = stack;
        Error.captureStackTrace(this, this.constructor);

        if (stack){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); }
    }
}

export {Apierror}
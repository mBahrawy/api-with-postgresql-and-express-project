import { validationResult } from "express-validator";

const myCustomValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    }
});

export default myCustomValidationResult;

import { validationResult } from "express-validator";

const myCustomValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            message: error.msg
        };
    }
});

export default myCustomValidationResult;

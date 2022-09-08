import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class ErrorResponsesService {
    public doesntExsistsError(msg = "Data doenst exsists."): ErrorResponse {
        return {
            error: msg,
            status: 404
        };
    }
    public serverError(msg = "Something went wrong, please try later"): ErrorResponse {
        return {
            error: msg,
            status: 500
        };
    }
    public nullValues(msg = "Some inputs are required, please check them and try again."): ErrorResponse {
        return {
            error: msg,
            status: 422
        };
    }
    public dublicatedValues(msg = "Some values must be unique"): ErrorResponse {
        return {
            error: msg,
            status: 400
        };
    }
}

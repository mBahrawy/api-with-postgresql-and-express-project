import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class ErrorResponsesService {
    public createError(msg = "Somthing wrong happened", status = 400): ErrorResponse {
        return {
            errors: [msg],
            status: status
        };
    }
    public entityRelationError(msg = "This entity is related to another entity in database."): ErrorResponse {
        return {
            errors: [msg],
            status: 403
        };
    }
    public invalidUserRole(msg = "You don't have a valid user role."): ErrorResponse {
        return {
            errors: [msg],
            status: 403
        };
    }
    public valueDoesntExsistsError(msg = "Data doenst exsists."): ErrorResponse {
        return {
            errors: [msg],
            status: 404
        };
    }
    public serverError(msg = "Something went wrong, please try later"): ErrorResponse {
        return {
            errors: [msg],
            status: 500
        };
    }
    public nullValues(msg = "Some inputs are required, please check them and try again."): ErrorResponse {
        return {
            errors: [msg],
            status: 400
        };
    }
    public dublicatedValues(msg = "Some values must be unique"): ErrorResponse {
        return {
            errors: [msg],
            status: 400
        };
    }
}

import * as mung from "express-mung";

const organizedResponse = (body) => {
    // delete body.status;

    return body;
};

export default mung.json(organizedResponse);

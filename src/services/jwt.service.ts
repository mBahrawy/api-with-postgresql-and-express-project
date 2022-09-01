import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { User } from "../interfaces/User";
import { TokenPayload } from "../interfaces/TokenPayload";

@Service()
export class JWT {
    public createToken(user: User): string {
        return jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    }
    public isValidToken(fullToken: string): boolean {
        try {
            const token = fullToken.split(" ")[1];
            return !!jwt.verify(token, process.env.TOKEN_SECRET as string);
        } catch (e) {
            return false;
        }
    }
    public isValidUserWithToken(fullToken: string, userId: number): boolean {
        try {
            if (!this.decodedToken(fullToken)) throw new Error("can't decode token");
            const user = this.decodedToken(fullToken)?.user;
            if (user?.id !== userId) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    public decodedToken = (fullToken: string): TokenPayload => {
        const token = fullToken.split(" ")[1];
        return jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;
    };

}

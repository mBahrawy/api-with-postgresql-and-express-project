import { Service } from "typedi";

@Service()
export class StringService {
    public genUniqueId = (): string => {
        return Date.now() + "+" + Math.random().toString(36).substr(2);
    };
}

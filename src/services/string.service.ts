export const genUniqueId = (): string => {
    return Date.now() + "+" + Math.random().toString(36).substr(2);
};

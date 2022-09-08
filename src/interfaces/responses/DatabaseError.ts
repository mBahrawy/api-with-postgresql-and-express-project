export interface DatabaseError {
    message?: string;
    sqlError: SqlError;
}

export interface SqlError {
    error?: string;
    length?: number;
    name?: string;
    severity?: string;
    code?: string;
    detail?: string;
    schema?: string;
    table?: string;
    column?: string;
    file?: string;
    line?: string;
    routine?: string;
}

class EmailConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "EmailConflictError";
    }
}


module.exports = EmailConflictError;
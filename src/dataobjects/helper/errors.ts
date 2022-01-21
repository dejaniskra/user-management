export class AlreadyExistsError extends Error {
    constructor(message: string, stack?: string) {
        super(message);
        this.name = "AlreadyExistsError";
        if (stack) {
            this.stack = stack;
        }
    }
}

export class NotFoundError extends Error {
    constructor(message: string, stack?: string) {
        super(message);
        this.name = "NotFoundError";
        if (stack) {
            this.stack = stack;
        }
    }
}

export class FileMissingError extends Error {
    constructor(message: string, stack?: string) {
        super(message);
        this.name = "FileMissingError";
        if (stack) {
            this.stack = stack;
        }
    }
}

export class ImageNotValidError extends Error {
    constructor(message: string, stack?: string) {
        super(message);
        this.name = "ImageNotValidError";
        if (stack) {
            this.stack = stack;
        }
    }
}

export class FeatureUnavailableError extends Error {
    constructor(message: string, stack?: string) {
        super(message);
        this.name = "FeatureUnavailableError";
        if (stack) {
            this.stack = stack;
        }
    }
}
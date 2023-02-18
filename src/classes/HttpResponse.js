class HttpResponse {
    #status = 200
    #message = {}

    constructor(status, message) {
        this.#status = status ?? 200;
        this.#message = message ?? {};
    }

    getStatus() {
        return this.#status;
    }

    getMessage() {
        return this.#message;
    }

    processResponse(res) {
        return res.status(this.#status).json(this.#message);
    }
}

module.exports = HttpResponse;
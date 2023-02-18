const config = require('../config/config');
class HttpResponse {
    #status = 200
    #message = {}

    constructor(status, message, exception) {
        this.#status = status ?? 200;
        this.#message = message ?? {};

        if (exception && config.DEBUG) {
            console.error(exception);
        }
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
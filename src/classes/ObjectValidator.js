class ObjectValidator {

    /**
     * @param schema <Joi.ObjectSchema>
     * @returns Object
     */
    static validate (schema, fields) {
        try {
            if (fields) {
                const { value: body, error } = schema.validate(fields);
                return this.#verify(body, error);
            }

            return { error: 'Invalid payload' };

        } catch (error) {
            return { error: 'Validation error'}
        }
    }

    /**
     * @param schema <Joi.ObjectSchema>
     * @returns Object
     */
    static #verify(body, error) {
        if (error) {
            return {
                error: {
                    field: error.details[0].context?.key ?? '',
                    message: error.details[0].message.replaceAll('"', ''),
                },
            };
        }

        return {
            success: body
        };
    }
}

module.exports = ObjectValidator;

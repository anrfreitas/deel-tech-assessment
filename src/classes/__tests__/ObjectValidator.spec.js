const Joi = require('joi');
const ObjectValidator = require('../ObjectValidator');

const rules = Joi.object({
    minField: Joi.string().min(4).required(),
    maxField: Joi.string().max(6).required(),
    emailField: Joi.string().email().required(),
    arrayField: Joi.string().valid('option1', 'option2').required(),
    booleanField: Joi.boolean().required(),
    notRequiredField: Joi.string().optional(),
});

const payload = {
    minField: 'John',
    maxField: 'Doe',
    emailField: 'john@doe.com',
    arrayField: 'option1',
    booleanField: true,
    notRequiredField: 'hello',
};

describe('Test ObjectValidator', () => {
    test('Testing Joi.min(x) expecting bad format exception', () => {
        const validation = ObjectValidator
            .validate(rules, {...payload, minField: '123'});

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error.field).toBe('minField');
        expect(validation.error.message).toBeDefined();
    });

    test('Testing Joi.max(x) expecting bad format exception', async () => {
        const validation = ObjectValidator
            .validate(rules, { ...payload, maxField: '1234567' });

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error.field).toBe('maxField');
        expect(validation.error.message).toBeDefined();
    });

    test('Testing Joi.email() expecting bad format exception', async () => {
        const validation = ObjectValidator
            .validate(rules, { ...payload, emailField: 'BAD_EMAIL_FORMAT' });

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error.field).toBe('emailField');
        expect(validation.error.message).toBeDefined();
    });

    test('Testing Joi.valid(arg1, arg2, ...) expecting bad format exception', async () => {
        const validation = ObjectValidator
            .validate(rules, { ...payload, arrayField: 'BAD_COUNTRY_FORMAT' });

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error.field).toBe('arrayField');
        expect(validation.error.message).toBeDefined();
    });

    test('Testing Joi.boolean() expecting bad format exception', async () => {
        const validation = ObjectValidator
            .validate(rules, { ...payload, booleanField: 'STRING_FORMAT' });

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error.field).toBe('booleanField');
        expect(validation.error.message).toBeDefined();
    });

    test('Omitting fields param expecting invalid payload error', async () => {
        const newPayload = { ...payload };
        delete newPayload.notRequiredField;

        const validation = ObjectValidator.validate(rules, undefined);

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error).toBe('Invalid payload');
    });

    test('Omitting schema param expecting validation error', async () => {
        const newPayload = { ...payload };
        delete newPayload.notRequiredField;

        const validation = ObjectValidator.validate(undefined, payload);

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error).toBe('Validation error');
    });

    test('Omitting schema and fields param expecting invalid payload error', async () => {
        const newPayload = { ...payload };
        delete newPayload.notRequiredField;

        const validation = ObjectValidator.validate(undefined, undefined);

        expect(validation.success).toBeUndefined();
        expect(validation.error).toBeDefined();
        expect(validation.error).toBe('Invalid payload');
    });

    test('Omitting not required field expecting no errors', async () => {
        const newPayload = { ...payload };
        delete newPayload.notRequiredField;

        const validation = ObjectValidator.validate(rules, newPayload);

        expect(validation.success).toBeDefined();
        expect(validation.error).toBeUndefined();
    });

    test('Testing valid Joi.schema and payload expecting no errors', async () => {
        const validation = ObjectValidator.validate(rules, payload);

        expect(validation.success).toBeDefined();
        expect(validation.error).toBeUndefined();
    });
});

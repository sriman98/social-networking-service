const validate = (value, rules) => {

    let valid = true;

    if (!rules) {
        return true;
    }

    if (rules.required) {
        valid = value.trim() !== '' && valid;
    }

    if (rules.minLength) {
        valid = value.length >= rules.minLength && valid;
    }

    if (rules.maxLength) {
        valid = value.length <= rules.maxLength && valid;
    }

    if (rules.email) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        valid = pattern.test(value) && valid
    }

    if (rules.regex) {
        valid = rules.regex.test(value) && valid;
    }

    return valid;
}

export default validate;
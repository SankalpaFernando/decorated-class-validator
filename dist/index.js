const validator = {};
export function Valid(args) {
    return (target, name) => {
        const cls = target.constructor.name;
        if (!validator[cls]) {
            validator[cls] = {};
        }
        validator[cls][name] = args;
    };
}
export function validate(cls) {
    const validation = validator[cls.constructor.name];
    const regex = {
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm,
        number: /^[0-9]+$/g,
        date: /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/gm,
        url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
        phone: /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g,
        letter: /^[a-zA-Z]+$/g,
        alphanumeric: /^[A-Za-z0-9]+$/g,
        symbolnumeric: /^[0-9$-/#%*()+=/;>.<@:-?{-~!"^_`\[\]]+$/g,
        alphasymbolic: /^[a-zA-Z$-/#%*()+=/;>.<@:-?{-~!"^_`\[\]]+$/g,
        ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    };
    let isValid = true;
    for (let field in validation) {
        for (let type in validation[field]) {
            const value = validation[field][type];
            switch (type) {
                case 'max':
                    isValid = isValid && cls[field] <= value;
                    break;
                case 'min':
                    isValid = isValid && cls[field] >= value;
                    break;
                case 'length':
                    for (let index in value) {
                        switch (index) {
                            case 'max':
                                isValid = isValid && (cls[field].length <= value[index]);
                                break;
                            case 'min':
                                isValid = isValid && (cls[field].length >= value[index]);
                                break;
                            case 'equal':
                                isValid = isValid && (cls[field].length === value[index]);
                                break;
                        }
                    }
                    break;
                case 'email':
                    isValid = isValid && (value ? regex.email.test(cls[field]) : true);
                    break;
                case 'date':
                    isValid = isValid && (value ? regex.date.test(cls[field]) : true);
                    break;
                case 'url':
                    isValid = isValid && (value ? regex.url.test(cls[field]) : true);
                    break;
                case 'phone':
                    isValid = isValid && (value ? regex.phone.test(cls[field]) : true);
                    break;
                case 'ip':
                    isValid = isValid && (value ? regex.ip.test(cls[field]) : true);
                    break;
                case 'content':
                    if (value.allowSpace) {
                        cls[field] = cls[field].split(' ').join('');
                    }
                    if (value.letter && value.number && value.symbol) {
                        isValid = isValid && true;
                    }
                    else if (value.number && value.letter && !value.symbol) {
                        isValid = isValid && (value ? regex.alphanumeric.test(cls[field]) : true);
                    }
                    else if (value.number && value.symbol && !value.letter) {
                        isValid = isValid && (value ? regex.symbolnumeric.test(cls[field]) : true);
                    }
                    else if (value.letter && value.symbol && !value.number) {
                        isValid = isValid && (value ? regex.alphasymbolic.test(cls[field]) : true);
                    }
                    else if (value.number && !value.letter && !value.symbol) {
                        isValid = isValid && (value ? regex.number.test(cls[field]) : true);
                    }
                    else if (!value.number && value.letter && !value.symbol) {
                        isValid = isValid && (value ? regex.letter.test(cls[field]) : true);
                    }
                    else if (!value.number && !value.letter && value.symbol) {
                        isValid = isValid && (value ? !regex.alphanumeric.test(cls[field]) : true);
                    }
                    break;
                case 'custom':
                    isValid = isValid && (value.test(cls[field]));
                    break;
            }
        }
    }
    return isValid;
}

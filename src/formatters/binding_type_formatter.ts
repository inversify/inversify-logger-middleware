/// <reference path="../interfaces/interfaces.d.ts" />

function bindingTypeFormatter(type: number) {
    switch (type) {
        case 1:
            return "Instance";
        case 2:
            return "ConstantValue";
        case 3:
            return "DynamicValue";
        case 4:
            return "Constructor";
        case 5:
            return "Factory";
        case 6:
            return "Provider";
        case 0:
        default:
            return "Invalid";
    }
}

export default bindingTypeFormatter;

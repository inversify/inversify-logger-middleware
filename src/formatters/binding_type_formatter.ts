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
            return "Function";
        case 7:
            return "Provider";
        case 0:
            return "Invalid";
    }
}

export default bindingTypeFormatter;

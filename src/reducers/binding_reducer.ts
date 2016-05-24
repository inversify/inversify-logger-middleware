function bindingReducer(
    binding: inversify.IBinding<any>,
    options: IBindingLoggerSettings
) {

    let props = [
        "type", "serviceIdentifier", "implementationType",
        "activated", "cache", "constraint", "dynamicValue",
        "factory", "onActivation", "provider", "scope"
    ];

    let reducedBinding: any = {};
    let bindingOptions: any = options;
    let oldBinding: any = binding;

    props.forEach((prop) => {
        if (bindingOptions[prop]) {
            reducedBinding[prop] = oldBinding[prop];
        }
    });

    return reducedBinding;
}

export default bindingReducer;

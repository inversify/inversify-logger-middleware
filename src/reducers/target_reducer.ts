function targetReducer(
    target: inversify.ITarget,
    options: ITargetLoggerSettings
) {


    let reducedTarget: any = {};
    let targetOptions: any = options;
    let oldTarget: any = target;

    if (targetOptions.name) {
        reducedTarget.name = oldTarget.name;
    }

    if (targetOptions.serviceIdentifier) {
        reducedTarget.serviceIdentifier = oldTarget.serviceIdentifier;
    }

    if (targetOptions.metadata && Array.isArray(target.metadata)) {
        let reducedMetadata = target.metadata.map((m: inversify.IMetadata, i: number) => {
            return {
                key: m.key,
                value: m.value
            };
        });
        reducedTarget.metadata = reducedMetadata;
    }

    return reducedTarget;
}

export default targetReducer;

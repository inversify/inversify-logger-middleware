import { Kernel, interfaces } from "inversify";

function serviceIdentifierFormatter(serviceIdentifier: interfaces.ServiceIdentifier<any>) {
    let k = new Kernel();
    let name = k.getServiceIdentifierAsString(serviceIdentifier);
    return name;
}

export default serviceIdentifierFormatter;

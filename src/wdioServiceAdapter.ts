export function wdioService(serviceDefinition: string | [string, object?, object?, object?]): Service {
    let servicePath = serviceDefinition;
    let options;
    let capabilities;
    let config;
    if (Array.isArray(serviceDefinition)) {
        [servicePath, options = {}, capabilities = {}, config = {}] = serviceDefinition;
    }
    const { launcher: ServiceClass } = require(servicePath as string);
    console.log(ServiceClass)
    const service = new ServiceClass(options, capabilities, config);
    service.before = service.onPrepare.bind(service, [config]);
    service.after = service.onComplete.bind(service, [config]);
    service.options = options;
    return service
}

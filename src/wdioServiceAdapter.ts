export function wdioService(serviceDefinition: string | [string, object?, object?, object?]): Service {
    let servicePath = serviceDefinition;
    let options: object | undefined = {};
    let capabilities: object | undefined = {};
    let config: object | undefined = {};
    if (Array.isArray(serviceDefinition)) {
        [servicePath, options, capabilities, config] = serviceDefinition;
    }
    const { launcher: ServiceClass } = require(servicePath as string);
    const service = new ServiceClass(options, capabilities, config);
    service.before = service.onPrepare.bind(service, [config, capabilities]);
    service.after = service.onComplete.bind(service, [config, capabilities]);
    service.options = options;
    return service
}

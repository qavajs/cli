export function wdioService(serviceDefinition: string | [string, object?, object?, object?]): Service {
    const [servicePath, options = {}, capabilities = {}, config = {}] = Array.isArray(serviceDefinition)
        ? serviceDefinition
        : [serviceDefinition];
    const { launcher: ServiceClass } = require(servicePath as string);
    const service = new ServiceClass(options, capabilities, config);
    service.before = service.onPrepare.bind(service, config, capabilities);
    service.after = service.onComplete.bind(service, config, capabilities);
    service.options = options;
    return service
}

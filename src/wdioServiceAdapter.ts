/**
 * Adapter for wdio services.
 * Service defintion may be string with module path or configuration tuple
 * [modulePath, options, capabilities, config]
 *
 * @param {string | [string, object?, object?, object?]} serviceDefinition - wdio service with params
 * @return {Service} - qavajs compatible service
 * @example wdioService('@wdio/selenium-standalone-service')
 * @example wdioService([
 *      '@wdio/appium-service',
 *      {
 *          args: {
 *              chromedriverExecutable: resolve('node_modules/chromedriver/lib/chromedriver/chromedriver.exe')
 *          }
 *      }
 * ])
 */
export async function wdioService(serviceDefinition: string | [string, object?, object?, object?]): Promise<Service> {
    const [servicePath, options = {}, capabilities = {}, config = {}] = Array.isArray(serviceDefinition)
        ? serviceDefinition
        : [serviceDefinition];
    const { launcher: ServiceClass } = await import(servicePath as string);
    const service = new ServiceClass(options, capabilities, config);
    service.before = service.onPrepare.bind(service, config, capabilities);
    service.after = service.onComplete.bind(service, config, capabilities);
    service.options = options;
    return service
}

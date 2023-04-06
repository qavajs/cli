import path from 'path';
import importConfig from './importConfig';
import {IRunResult} from '@cucumber/cucumber/api';

export default class ServiceHandler {
    private config: Promise<Config>;
    readonly services: Promise<Array<Service>>;
    constructor(configPath: string, profile: string) {
        this.config = importConfig(configPath, profile) as Promise<Config>;
        this.services = this.loadServices();
    }

    async loadServices() {
        const config = await this.config;
        if (!config.service) return [];
        const services = config.service.map(async svcDef => {
            const svc = await svcDef;
            if (typeof svc === 'string') {
                try {
                    return import(svc)
                } catch (e) {
                    return import(path.join(process.cwd(), svc))
                }
            }
            else if (Array.isArray(svc)) {
                const [svcPath, options] = svc;
                let service;
                try {
                    service = await import(svcPath)
                } catch (e) {
                    service = import(path.join(process.cwd(), svcPath))
                }
                service.options = options;
                return service
            }
            else {
                return svc
            }
        });
        return Promise.all(services);
    }

    async before() {
        for (const svc of await this.services) {
            if (svc.before) return svc.before();
        }
    }

    async after(result: IRunResult) {
        for (const svc of await this.services) {
            if (svc.after) return svc.after(result);
        }
    }
}

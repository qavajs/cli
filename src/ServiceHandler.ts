import path from 'path';
import {isArray} from "util";

export default class ServiceHandler {
    private config: Config;
    readonly services: Array<Service>;
    constructor(configPath: string, profile: string) {
        this.config = require(path.join(process.cwd(), configPath))[profile];
        this.services = this.loadServices();
    }

    loadServices() {
        return this.config.service.map(svc => {
            if (typeof svc === 'string') {
                try {
                    require.resolve(svc);
                    return require(svc)
                } catch (e) {
                    return require(path.join(process.cwd(), svc))
                }
            }
            else if (Array.isArray(svc)) {
                const [svcPath, options] = svc;
                let service;
                try {
                    require.resolve(svcPath);
                    service = require(svcPath)
                } catch (e) {
                    service = require(path.join(process.cwd(), svcPath))
                }
                service.options = options;
            }
            else {
                return svc
            }
        })
    }

    async before() {
        for (const svc of this.services) {
            if (svc.before) return svc.before();
        }
    }

    async after() {
        for (const svc of this.services) {
            if (svc.after) return svc.after();
        }
    }
}

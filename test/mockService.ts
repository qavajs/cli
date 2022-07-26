type Optional<T> = T | undefined;

class MockService {
    public options: Optional<object>;
    public capabilities: Optional<object>;
    public config: Optional<object>;

    public onPrepareConfig: Optional<object>;
    public onPrepareCapabilities: Optional<object>;

    public onCompleteConfig: Optional<object>;
    public onCompleteCapabilities: Optional<object>;

    constructor(options: Optional<object>, capabilities: Optional<object>, config: Optional<object>) {
        this.options = options;
        this.capabilities = capabilities;
        this.config = config;
    }

    onPrepare(config: Optional<object>, capabilities: Optional<object>) {
        this.onPrepareConfig = config;
        this.onPrepareCapabilities = capabilities;
        return { config, capabilities }
    }

    onComplete(config: Optional<object>, capabilities: Optional<object>) {
        this.onCompleteConfig = config;
        this.onCompleteCapabilities = capabilities;
        return { config, capabilities }
    }
}

export { MockService as launcher }

declare type Config = {
    service: Array<any>;
}

declare type Service = {
    options?: Object,
    capabilities?: Object,
    config?: Object,
    before?: Function,
    after?: Function
}

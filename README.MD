[![npm version](https://badge.fury.io/js/@qavajs%2Fcli.svg)](https://badge.fury.io/js/@qavajs%2Fcli)

## @qavajs/cli

Cli for @qavajs framework.
          
`npm install @qavajs/cli`

Setup project

`npx qavajs install`

Run tests

`npx qavajs run --config <config> --profile <profile>`

### Override memory values
In case if tests need to be run with updated memory value they can be passed via CLI (e.g run scenarios on some other url)
It can be done by passing `--memory-values` parameter which is JSON with params that need to be overridden

example

```npx qavajs run --config config.ts --memory-values '{"url": "https://github.com"}'``` 

it will override $url memory value

### Service
Services is an entities that can execute logic before and after whole test run.

```javascript
module.exports = {
    default: {
        service: [{
            after(result) {
                if (!result.success) process.exit(1);
            }
        }]
    }
}
```
There is a 10 minutes default timeout for a before and after test logic to prevent entire process from freezing.
To set up custom timeout in milliseconds use serviceTimeout property in config.
```javascript
module.exports = {
    default: {
        serviceTimeout: 1_200_000
    }
}
```


### Pass CLI params to workers
All params that you passed to qavajs cli will be available in CLI_ARGV environment variable in all child workers.

### Override step definition
```javascript
const { Override } = require('@qavajs/cli/utils');

When('I do test', async function() {});

Override('I do test', async function() {
    console.log('I am overridden')
});
```

### Test Sharding
qavajs provides ability to shard your tests between different machines. To do so pass `--shard x/y` parameter in CLI,
where x - current shard, y - total number of shards.

```
npx qavajs run --config config.js --shard 1/2
npx qavajs run --config config.js --shard 2/2
```

### Execute steps from other steps
It is possible to implement complex logic using built-in qavajs steps via `executeStep` world method
```javascript
When('I do smth complex', async function() {
    await this.executeStep(`I type 'username' to 'Username Input'`);
    await this.executeStep(`I type 'password' to 'Password Input'`);
    await this.executeStep(`I click 'Login Button'`);
    await this.executeStep(`I fill following fields`, new DataTable([
        [ 'Order', '123' ],
        [ 'Delivery Location', 'New York' ]
    ]))
});
```

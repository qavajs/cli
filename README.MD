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

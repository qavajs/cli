[![npm version](https://badge.fury.io/js/@qavajs%2Fcli.svg)](https://badge.fury.io/js/@qavajs%2Fcli)

## @qavajs/cli

Cli for @qavajs framework.
          
`npm install @qavajs/cli`

Setup project

`npx qavajs install`

Run tests

`npx qavajs run --config <config> --profile <profile>`

### WDIO Adapter
@qavajs/cli also comes with wdioAdapter function that allow to use wdio services e.g selenium-service, appium-service, etc.
Service defintion may be string with module path or configuration tuple [modulePath, options, capabilities, config

simple use:
```javascript
const { wdioService } = require('@qavajs/cli');

module.exports = {
    default: {
        service: [
            wdioService('@wdio/selenium-standalone-service')
        ],
    }
}
```

use with params
```javascript
const { wdioService } = require('@qavajs/cli');

module.exports = {
    default: {
        service: [
            wdioService([
                '@wdio/appium-service',
                {
                    args: {
                        chromedriverExecutable: resolve('node_modules/chromedriver/lib/chromedriver/chromedriver.exe')
                    }
                }
            ])
        ],
    }
}
```

### Override memory values
In case if tests need to be run with updated memory value they can be passed via CLI (e.g run scenarios on some other url)
It can be done by passing `--memory-values` parameter which is JSON with params that need to be overridden

example

```npx qavajs run --config config.js --memory-values '{"url": "https://github.com"}'``` 

it will override $url memory value

### Built-in computed
@qavajs comes with a set of built-in computed

`$file(path: string)` - read file as buffer
```Gherkin
Then I expect '$file("./path-to-file")' to be equal '$buffer'
```

`$textFile(path: string)` - read file as text (utf-8)
```Gherkin
Then I expect text of 'Some Element' to be equal '$textFile("./path-to-file")'
```

`$number(value: string)` - cast value to number
```Gherkin
Then I expect '$someNumberValue' to be equal '$number(42)'
```

`$boolean(value: string)` - cast value to boolean
```Gherkin
Then I expect '$someBooleanValue' to be equal '$boolean("true")'
```

`$string(value: string)` - cast value to string
```Gherkin
Then I expect '$someBooleanValue' to be equal '$string(42)'
```

`$env(variableName: string)` - read environment variable
```Gherkin
Then I open '$env("BASE_URL")' url
```

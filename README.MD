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


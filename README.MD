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

`$json(path: string)` - read file as buffer
```Gherkin
Then I expect '$json("./path-to-file")' to be equal '$object'
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

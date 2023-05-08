## 0.0.23
Breaking Change:
- removed wdio service adapter 
(adapter has been extracted to separate module https://www.npmjs.com/package/@qavajs/wdio-service-adapter)

## 0.0.22
- fixed support of multiple services

## 0.0.21
- added capability handle cucumber result in services

## 0.0.20
- fixed steps imports paths to import only main file
- added local step_definition folder to install script

## 0.0.19
- fixed install path for esm and typescript

## 0.0.18
- added question to select commonjs / esm modules / typescript
- added json computed

## 0.0.17
- esm support

## 0.0.15
- make qavajs cli compatible with cucumber cli

## 0.0.14
- added @qavajs/steps-sql
- added @qavajs/steps-accessibility

## 0.0.13
- added @qavajs/html-formatter
- added default out path for formatter packages

## 0.0.12
- added playwright option
- added computed to read environment variable
- added files option
- removed parallel option

## 0.0.11
- updated run logic to use runCucumber() API instead of deprecated CLI()
- added default logic if unrecognized command set

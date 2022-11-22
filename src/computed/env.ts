export default {
    /**
     * Read environment variable
     * @param variableName
     * @example
     * When I open '$env("BASE_URL")'
     */
    env: (variableName: string) => process.env[variableName]
}

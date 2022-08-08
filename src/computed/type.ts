export default {
    number: (numberLike: string): number => parseFloat(numberLike),
    boolean: (booleanLike: string) => {
        if (booleanLike === 'true') return true
        if (booleanLike === 'false') return false
        throw Error('Passed value is not boolean-like');
    },
    string: (stringLike: any): string => stringLike.toString()
}

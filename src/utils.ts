import {defineStep, IWorld, supportCodeLibraryBuilder} from '@cucumber/cucumber';

export function Override(pattern: string | RegExp, ...rest: any[]): void {
    // @ts-ignore
    const definitionIndex = supportCodeLibraryBuilder.stepDefinitionConfigs.findIndex(
        (definition: { pattern: string | RegExp }) => definition.pattern === pattern
    );
    // @ts-ignore
    supportCodeLibraryBuilder.stepDefinitionConfigs.splice(definitionIndex, 1);
    // @ts-ignore
    defineStep(pattern, ...rest);
}

let world: IWorld;
export function bindWorld(worldObject: IWorld) {
    world = worldObject;
}
export async function executeStep(this: any, text: string) {
    const stepDefsLibrary = supportCodeLibraryBuilder.buildStepDefinitions();
    const step = stepDefsLibrary.stepDefinitions.find(s => s.matchesStepName(text));
    if (!step) throw new Error(`Step "${text}" is not defined`);
    const { parameters } = await step.getInvocationParameters({ step: { text }, world } as any);
    await step.code.apply(world, parameters);
}

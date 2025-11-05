export interface ISideEffect{
    label: string,
    effect: (...arg: any) => Promise<void> | void 
}
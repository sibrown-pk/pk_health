export interface IQlikAppURLConfig {
    appID: string;
    appObjectID: string;
    appSheetID:string;
    appOptions: Array<string>;
    appSelections: Array<IQlikAppSelection>;
    appConfiguration: string;
}

export interface IQlikAppSelection {
    dimension: string;
    values: Array<string>;
}

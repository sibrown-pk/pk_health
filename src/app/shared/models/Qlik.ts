import { IQlikAppURLConfig, IQlikAppSelection } from '../interfaces/IQlik';
import { C_QLIK_LOMM_APP_ID, C_QLIK_OBJECT_ID, C_QLIK_LOMM_SHEET_ID, C_QLIK_SERVER_LOMM_URL_OPTIONS, C_QLIK_APP_LOMM_CONFIG, C_QLIK_APP_FILTER_DIMENSION_DEFAULT, C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, C_QLIK_HSC_APP_ID, C_QLIK_HSC_SHEET_ID, C_QLIK_SERVER_HSC_URL_OPTIONS, C_QLIK_APP_HSC_CONFIG } from '../constants/qlik_server_parameters';

export class MLommQlikAppURLConfig implements IQlikAppURLConfig {
    appID = C_QLIK_LOMM_APP_ID;
    appObjectID = C_QLIK_OBJECT_ID;
    appSheetID = C_QLIK_LOMM_SHEET_ID;
    appOptions = [C_QLIK_SERVER_LOMM_URL_OPTIONS.noInteraction];
    appConfiguration = C_QLIK_APP_LOMM_CONFIG;
    appSelections: Array<IQlikAppSelection> = [{
        dimension: C_QLIK_APP_FILTER_DIMENSION_DEFAULT,
        values: [C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT]
    }];

    constructor(options?: IQlikAppURLConfig) {
        if (options) {
            Object.keys(options).forEach((key) => {
                this[key] = options[key];
            });
        }
    }
}

export class MHscQlikAppURLConfig implements IQlikAppURLConfig {
    appID = C_QLIK_HSC_APP_ID;
    appObjectID = C_QLIK_OBJECT_ID;
    appSheetID = C_QLIK_HSC_SHEET_ID;
    appOptions = [C_QLIK_SERVER_HSC_URL_OPTIONS.noInteraction];
    appConfiguration = C_QLIK_APP_HSC_CONFIG;
    appSelections: Array<IQlikAppSelection> = [{
        dimension: C_QLIK_APP_FILTER_DIMENSION_DEFAULT,
        values: [C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT]
    }];

    constructor(options?: IQlikAppURLConfig) {
        if (options) {
            Object.keys(options).forEach((key) => {
                this[key] = options[key];
            });
        }
    }
}

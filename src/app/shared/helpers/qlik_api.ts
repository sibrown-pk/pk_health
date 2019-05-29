import { IQlikAppSelection, IQlikAppURLConfig } from '../interfaces/IQlik';
import { C_QLIK_LOMM_SERVER_PROTOCOL, C_QLIK_LOMM_SERVER_DOMAIN, C_QLIK_LOMM_SERVER_PORT } from '../constants/qlik_server_parameters';

export class QlikAPI {
    constructor() { }
    public static generateQlikAppURL =
        (configOptions: IQlikAppURLConfig, protocol: string = C_QLIK_LOMM_SERVER_PROTOCOL, domain: string = C_QLIK_LOMM_SERVER_DOMAIN, port = C_QLIK_LOMM_SERVER_PORT): string => {
            const generateOptstring = (appOptions: Array<string> = []): string => {
                let returnString = '';
                if (appOptions.length === 0) {
                    return returnString;
                } else {
                    appOptions.forEach((item) => { returnString = `${returnString}&opt=${item}`; });
                    return returnString;
                }
            };

            const generateSelectionString = (appSelections: Array<IQlikAppSelection>) => {
                let returnString = '';
                if (appSelections.length === 0) {
                    return returnString;
                } else {
                    appSelections.forEach(item => {
                        returnString = `${returnString}&select=${item.dimension},${item.values.join(',')}`;
                    });
                    return returnString;
                }
            };
            // return `${protocol}://${domain}:${port}${configOptions.appConfiguration}?appid=${configOptions.appID}&obj=${configOptions.appObjectID}${generateOptstring(configOptions.appOptions)}${generateSelectionString(configOptions.appSelections)}`;
            return `${protocol}://${domain}${port ? ':' + port : ''}${configOptions.appConfiguration}?appid=${configOptions.appID}&sheet=${configOptions.appSheetID}${generateOptstring(configOptions.appOptions)}&select=clearall${generateSelectionString(configOptions.appSelections)}`;
        }

}


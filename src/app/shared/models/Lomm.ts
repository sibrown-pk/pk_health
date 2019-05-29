import { ILomm, ICardSummaryContent } from '../interfaces/ILomm';

export class MLomm implements ILomm {
    MeasureName = '';
    Period = '';
    Actual = '';
    Goal = '';
    Division = '';
    'Reporting Period' = '';
    Format = '';
    'Measure Order': number = null;
    summary: ICardSummaryContent = null;
    Color = '';
    BgImage = '';
    MeasureLabel = '';
    danger: boolean = null;
    QuaterData = '';
    QlikUrl = '';

    constructor(lomm?: ILomm) {
        if (lomm) {
            Object.keys(lomm).forEach(key => {
                this[key] = lomm[key];
            });
        }
    }
}

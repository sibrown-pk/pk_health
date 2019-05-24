import { ILomm } from '../interfaces/ILomm';

export class CardDataHelper {
    constructor() { }

    public static metricUnit = (format: string): string => {
        let unit = '';
        format = format ? format.toLowerCase() : null;
        switch (format) {
            case 'percent':
                unit = '%';
                break;
            case 'number':
                unit = '';
                break;
            default:
                unit = '';
                break;
        }
        return unit;
    }
    public static transformationCardDataFormat(card: ILomm): ILomm {
        if (card.MeasureName.trim().toLowerCase() === 'transformation') {
            const actualFigure = card.Actual.toString().toLowerCase().trim();
            const goalFigure = card.Goal.toString().toLowerCase().trim();
            if (actualFigure !== '0' && actualFigure !== 'tbd' && actualFigure !== 'null' && actualFigure !== 'na') {
                card.Actual = parseFloat(actualFigure).toFixed(1);
            }
            if (goalFigure !== '0' && goalFigure !== 'tbd' && goalFigure !== 'null' && goalFigure !== 'na') {
                card.Goal = parseFloat(goalFigure).toFixed(1);
            }
        }
        return card;
    }
}

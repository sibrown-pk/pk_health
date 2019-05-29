export interface ILomm {
    MeasureName: string;
    Period: string;
    Actual: string;
    Goal: string;
    Division: string;
    'Reporting Period': string;
    Format: string;
    'Measure Order': number;
    summary?: ICardSummaryContent;
    Color?: string;
    BgImage?: string;
    MeasureLabel?: string;
    danger?: boolean;
    QuaterData?: string;
    QlikUrl?: string;
}

export interface ICardSummary {
    'Employee Engagement'?: ICardSummaryContent;
    'Operating EBIDA'?: ICardSummaryContent;
    Growth?: ICardSummaryContent;
    'Quality'?: ICardSummaryContent;
    'Patient Experience'?: ICardSummaryContent;
    'Physician Engagement'?: ICardSummaryContent;
    Safety?: ICardSummaryContent;
    'Service to the Poor & Vulnerable'?: ICardSummaryContent;
    Transformation?: ICardSummaryContent;
}

export interface ICardSummaryContent {
    summary: string;
    link1?: ILink | string;
    link2?: ILink | string;
    link3?: ILink | string;
    link4?: ILink | string;
    link5?: ILink | string;
    link6?: ILink | string;
}

export interface ILink {
    label: string;
    link: string;
}

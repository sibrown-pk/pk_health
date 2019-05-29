import { C_ALL_HOSPITAL_KEY } from '../constants/hsc';
import { IHospitalData } from '../interfaces/IHsc';

export class MHscMonthWiseData {
    FiscalYear: string | number = '';
    Month: string | number = '';
    MonthNumber: string | number = '';
    constructor(obj: any) {
        if (obj) {
            this.FiscalYear = obj.FiscalYear;
            this.Month = obj.Month;
            this.MonthNumber = obj.MonthNumber;
        }
    }
}

export class MHscHospitalData implements IHospitalData {
    Division = '';
    Hospital = '';
    isDefault = false;
    constructor(obj: any) {
        if (obj) {
            this.Division = obj.Division;
            this.Hospital = obj.Hospital;
            this.isDefault = this.Hospital === C_ALL_HOSPITAL_KEY ? true : false;
        }
    }
}


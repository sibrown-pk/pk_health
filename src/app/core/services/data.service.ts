import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { C_API_URL, C_LOMM_DATA_URL, C_LOMM_CARD_STYLE_URL, C_QUICK_LINKS, C_MENU_DATA_URL, C_HSC_KPI_DATA } from 'src/app/shared/constants/paths';
import { Papa } from 'ngx-papaparse';
import { ICardSummary } from 'src/app/shared/interfaces/ILomm';
// tslint:disable:max-line-length
@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'my-auth-token'
    })
  };
  cardDataResult = {} || [];
  private API_URL = C_API_URL;
  private DATA_URL = isDevMode() ? `./../../../${C_LOMM_DATA_URL}` : C_LOMM_DATA_URL;
  private DATA_STYLE_URL = isDevMode() ? `./../../../${C_LOMM_CARD_STYLE_URL}` : C_LOMM_CARD_STYLE_URL;
  private QUICK_LINKS_URL = isDevMode() ? `./../../../${C_QUICK_LINKS}` : C_QUICK_LINKS;
  private MENU_DATA_URL = isDevMode() ? `./../../../${C_MENU_DATA_URL}` : C_MENU_DATA_URL;
  private HSC_KPI_DATA = isDevMode() ? `./../../../${C_HSC_KPI_DATA}` : C_HSC_KPI_DATA;

  constructor(private http: HttpClient, private papa: Papa) { }

  getLommData() {
    return this.CSVtoJson(this.DATA_URL);
  }
  getMenuData() {
    return this.CSVtoJson(this.MENU_DATA_URL);
  }
  public CSVtoJson = (filePath: string): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      const options = {
        download: true,
        header: true,
        complete: (results, file) => {
          resolve(results.data);
        },
        error: (e) => {
          console.error(e);
          reject(e);
        }
      };
      this.papa.parse(filePath, options);
    });
  }
  getLommCardStyles() {
    return this.http.get(this.DATA_STYLE_URL, this.httpOptions).toPromise();
  }

  getQuickLinksData(): Promise<Object> {
    // return this.http.get(this.QUICK_LINKS_URL, this.httpOptions).toPromise();
    return this.CSVtoJson(this.QUICK_LINKS_URL);
  }

  getLommCardInfo() {
    return [
      {
        'Employee Engagement': { 'class': 'empeng', 'measureLabel': 'mean' },
        'Growth': { 'class': 'growth', 'measureLabel': 'of NPSR' },
        'Operating EBIDA': { 'class': 'operating', 'measureLabel': 'of Gross Revenue' },
        'Patient Experience': { 'class': 'patexp', 'measureLabel': 'percentile' },
        'Physician Engagement': { 'class': 'physsat', 'measureLabel': 'percentile' },
        'Quality': { 'class': 'quality', 'measureLabel': 'percentile' },
        'Safety': { 'class': 'safety', 'measureLabel': 'percentile' },
        'Service to the Poor & Vulnerable': { 'class': 'svfp', 'measureLabel': 'of gross revenue' },
        'Transformation': { 'class': 'transform', 'measureLabel': 'TBD' }
      }
    ];
  }

  getLommCardSummary(): ICardSummary {
    return {
      'Employee Engagement': {
        'summary': 'Aggregate of key drivers of employee motivation and commitment to the organization and it\'s success. Specific questions & frequency to be determined based on vendor selection/benchmarking.',
        'link1': {
          'label': 'Employee Engagement Dashboard',
          'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/e73fb407-a751-4080-9545-a7de95915f08/sheet/d108c6a5-c8de-4281-a57f-3bdbc9f5517e/state/analysis'
        },
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Operating EBIDA': {
        'summary': 'Measures profitability of operating cash flow before non-operating items, financing expenses and restructuring (excludes interest and depreciation expense).',
        'link1': { 'label': 'Operational Performance Dashboard (OPD)', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/313c281a-8959-461c-aec0-29f49fb3726c/sheet/922ccbc7-604f-42c9-ae0a-33bf975936a4/state/analysis' },
        'link2': { 'label': 'Labor Productivty Dashboard (LPD)', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/4c478b11-838b-4169-9cc7-893ca1d76ca6/sheet/sRHBZFk/state/analysis' },
        'link3': { 'label': 'Medical Group Enterprie Dashboard (MGE)', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/2240c377-894a-4310-8168-3eb53de27cda/sheet/00bd29a0-bd30-4045-8022-d6979a1f10c9/state/analysis' },
        'link4': { 'label': 'Supply Initiative Dashboard', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/deccd59f-407a-4569-a187-faa5dd8b1b0f/sheet/6158776c-8184-4b9a-a91e-825625ec811b/state/analysis' },

        'link5': { 'label': 'Volume Pattern Explorer (VPE)', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/6ae84ab7-8c7d-4d53-84f3-fb0491876a58/sheet/fbe810ea-adc5-4330-9850-2fde7926a1b2/state/analysis' },
        'link6': { 'label': 'Service Profitability Explorer (SPE)', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/67865bea-0652-4140-a8dd-8d5bbe668a5f/sheet/bcaa8f49-096f-4782-a405-4b9d959e2a2e/state/analysis' }
      },
      'Growth': {
        'summary': 'Average annual percentage increase in Net Patient Service Revenue (NPSR) excluding new market entry. Baseline equals average annual increase in Net Patient Service Revenue (NPSR) for the three-year period FY2011 – FY2014 excluding SLHS, MHSET. Market metrics exclude M&A gains.',
        'link1': '',
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Quality': {
        'summary': 'Aggregate of seven nationally recognized key indicators for the quality of care a patient receives during their hospital stay: Death due to Heart Attack/Pneumonia/Congestive Heart Failure, Catheter Associated Urinary Tract Infections, Central Line Associated Blood Stream Infections, Surgical Site Infections following Colon and Abdominal Hysterectomy.',

        'link1': { 'label': 'Dynamic Analytic', 'link': 'https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsViewer/VisualAnalyticsViewer_guest.jsp?saspfs_request_backurl_list=https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsHub&saspfs_request_backlabel_list=Home&saspfs_request_path_url=SBIP://METASERVER/Analytic+Portal/Visual+Analytics/Reports/Living+Our+Mission+Measures%28Report%29&saspfs_request_entitykey=A5SH6NTT.AX0000M9/Transformation&_vaSectionName=vi1&appSwitcherDisabled=true&propertiesEnabled=false&commentsEnabled=false&reportViewOnly=false' },
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Patient Experience': {
        'summary': 'Aggregate of eight nationally recognized key indicators of a patient’s experience: Communication with Nurses and Doctors, Responsiveness of the Staff, Pain Management, Communication about Medicines, Hospital Cleanliness and Quietness, Discharge Information, and Overall Rating of Hospital.',
        'link1': { 'label': 'Dynamic Analytic', 'link': 'https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsViewer/VisualAnalyticsViewer_guest.jsp?saspfs_request_backurl_list=https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsHub&saspfs_request_backlabel_list=Home&saspfs_request_path_url=SBIP://METASERVER/Analytic+Portal/Visual+Analytics/Reports/Living+Our+Mission+Measures%28Report%29&saspfs_request_entitykey=A5SH6NTT.AX0000M9/Transformation&_vaSectionName=vi1&appSwitcherDisabled=true&propertiesEnabled=false&commentsEnabled=false&reportViewOnly=false' },
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Physician Engagement': {
        'summary': 'Aggregate of four key drivers of independent and employed provider overall satisfaction with the hospital:Comminucation with physicians,Involment of Medical Staff in Decision Making,Quality Consistency and likelyhood to recommend the hospital.Source HealthStream',
        'link1': { 'label': 'Physician Engagement Dashboard', 'link': 'http://rdcbiqlik08.chi.catholichealth.net/sense/app/20905ea5-f5b5-48a3-80a1-d42f52fd4e3d/sheet/d790140f-970b-4f80-af6d-3baef60c61b3/state/analysis' },
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Safety': {
        'summary': 'Aggregate of eight nationally recognized key indicators for patient safety during a patient’s hospital stay and are referred to as a PSI 90 Score: Pressure Ulcer, Iatrogenic (caused by us) Pneumothorax (collapsed lung), Central Venous Central Line Associated Blood Stream Infection, Postop Hip Fracture/Pulmonary Embolism (blood clot to lung)/Deep Vein Thrombosis/Sepsis/Wound Dehiscence/Accidental Puncture or Laceration.',
        'link1': { 'label': 'Dynamic Analytic', 'link': 'https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsViewer/VisualAnalyticsViewer_guest.jsp?saspfs_request_backurl_list=https://rdceisasmm01.chi.catholichealth.net/SASVisualAnalyticsHub&saspfs_request_backlabel_list=Home&saspfs_request_path_url=SBIP://METASERVER/Analytic+Portal/Visual+Analytics/Reports/Living+Our+Mission+Measures%28Report%29&saspfs_request_entitykey=A5SH6NTT.AX0000M9/Transformation&_vaSectionName=vi1&appSwitcherDisabled=true&propertiesEnabled=false&commentsEnabled=false&reportViewOnly=false' },
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Service to the Poor & Vulnerable': {
        'summary': 'Payer mix of charity care, self-pay, and Medicaid as a % of gross revenue.',
        'link1': '',
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      },
      'Transformation': {
        'summary': 'Number of attributed lives on behalf of which CHI manages health services.',
        'link1': '',
        'link2': '',
        'link3': '',
        'link4': '',
        'link5': '',
        'link6': ''
      }
    };
  }

  getHosiptalKPIData() {
    return this.CSVtoJson(this.HSC_KPI_DATA);
  }



}

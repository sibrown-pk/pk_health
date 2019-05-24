import { IBreakpointConfig } from '../interfaces/IBreakpoint';

export class MBreakpointConfig implements IBreakpointConfig {
    xs = 0;
    sm = 576;
    md = 768;
    lg = 992;
    xl = 1200;
    constructor(breakpoints?: IBreakpointConfig) {
        if (breakpoints) {
            Object.keys(breakpoints).forEach(key => {
                this[key] = breakpoints[key];
            });
        }
    }
}

export interface WindowSize {
    width: number;
    height: number;
}

export interface BreakpointEvent {
    breakpointName: string;
    size: WindowSize;
}

export interface IBreakpointConfig {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}
export interface IResponsiveViewManager {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
}
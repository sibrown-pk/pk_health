import { Injectable, NgZone, Optional } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IBreakpointConfig, BreakpointEvent, WindowSize } from 'src/app/shared/interfaces/IBreakpoint';
import { defaultBreakpoints } from 'src/app/shared/constants/breakpoint';
import { MBreakpointConfig } from 'src/app/shared/models/Breakpoint';
@Injectable({
    providedIn: 'root'
})
export class BreakpointService {

    private lastBreakpoint: string = null;
    private breakpoints: IBreakpointConfig = defaultBreakpoints;
    private changesSubject: BehaviorSubject<BreakpointEvent>;
    private currWindowWidthSubject: BehaviorSubject<number>;

    public breakpointChanges: Observable<BreakpointEvent>;
    public resize: Observable<WindowSize>;

    private screenSizeOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
    public currentBreakpoint: string;
    public currentWindowWidth: number;
    public $currentWindowWidth: Observable<number>;

    constructor(private ngZone: NgZone,
        @Optional() customBP: MBreakpointConfig
    ) {

        this.setBreakpoints(customBP);
        this.resize = fromEvent(window, 'resize').pipe(map(() => this.getWindowSize), distinctUntilChanged());

        const initialBreakpoint = this.getBreakpoint(window.innerWidth);
        this.changesSubject = new BehaviorSubject<BreakpointEvent>(this.getBreakpointEvent(initialBreakpoint));
        this.breakpointChanges = this.changesSubject.pipe(distinctUntilChanged((x, y) => x.breakpointName === y.breakpointName));
        this.currentWindowWidth = this.getWindowSize.width;
        this.currWindowWidthSubject = new BehaviorSubject<number>(this.currentWindowWidth);
        this.$currentWindowWidth = this.currWindowWidthSubject.asObservable();
        this.subscribe();
    }

    // Subscribe to the resize event
    private subscribe() {

        // Make sure resize event doesn't trigger change detection by running outside of angular zone
        this.ngZone.runOutsideAngular(() => {

            this.resize.subscribe((size: WindowSize) => {

                const breakpoint: string = this.getBreakpoint(size.width);
                this.currentWindowWidth = size.width;

                if (breakpoint === this.lastBreakpoint) {
                    return;
                }

                this.lastBreakpoint = breakpoint;

                // Emitting back in angular zone
                this.ngZone.run(() => {

                    this.currWindowWidthSubject.next(this.currentWindowWidth);
                    this.changesSubject.next(this.getBreakpointEvent(breakpoint));

                });
            });
        });
    }

    // Sets the customized breakpoints
    public setBreakpoints(breakpoints?: IBreakpointConfig) {
        console.log('Custom break points:', breakpoints);

        if (breakpoints) {
            this.breakpoints = breakpoints;
        }
    }

    public getBreakpoints(): IBreakpointConfig {
        return this.breakpoints;
    }


    // Returns a breakpoint event, with the fallback breakpoint if none were found
    public getBreakpointEvent(name?: string): BreakpointEvent {
        if (!name) {
            return { breakpointName: 'default', size: this.getWindowSize };
        } else {
            return { breakpointName: name, size: this.getWindowSize };
        }
    }

    // Returns the current window size
    public get getWindowSize(): WindowSize {
        return { width: window.innerWidth, height: window.innerHeight };
    }

    public getBreakpointChange(): Observable<BreakpointEvent> {
        return this.breakpointChanges;
    }


    // Returns the first breakpoint that match the current size
    public getBreakpoint(currentWindowWidth: number): string {
        const keys = Object.keys(this.breakpoints);

        for (let i = keys.length - 1; i >= 0; i--) {
            if (this.breakpoints[keys[i]] < currentWindowWidth) {

                this.currentBreakpoint = keys[i];
                return this.currentBreakpoint;
            }
        }

        return null;
    }

    public getCurrentWindowWidth(): Observable<number> {
        return this.$currentWindowWidth;
    }

    // Returns currentBreakPoint
    isCurrentBreakPoint(breakpointName: string): boolean {
        return this.currentBreakpoint === breakpointName;
    }

    // Returns belowbreakpoint
    isBelowBreakPoint(breakpointName: string): boolean {
        return this.screenSizeOrder.indexOf(this.currentBreakpoint) <= this.screenSizeOrder.indexOf(breakpointName);
    }

    // Returns aboveBreakPoint
    isAboveBreakPoint(breakpointName: string): boolean {
        return this.screenSizeOrder.indexOf(this.currentBreakpoint) > this.screenSizeOrder.indexOf(breakpointName);
    }

}


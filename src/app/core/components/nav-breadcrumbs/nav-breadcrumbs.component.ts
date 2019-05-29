import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IAppNavigation } from 'src/app/shared/interfaces/IAppNavigation';
import { Router, NavigationEnd, ActivatedRoute, Route } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { routes } from 'src/app/app.routing.module';

@Component({
  selector: 'app-nav-breadcrumbs',
  templateUrl: './nav-breadcrumbs.component.html',
  styleUrls: ['./nav-breadcrumbs.component.scss']
})
export class NavBreadcrumbsComponent implements OnInit, OnDestroy {
  private _navBreadcrumbs: Array<IAppNavigation> = [];
  private subscriptions = new Subscription();


  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(event => this.buildBreadCrumb(this.activatedRoute.root))
      ).subscribe({
        next: (res) => {
          this._navBreadcrumbs = res;
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '',
    breadcrumbs: Array<IAppNavigation> = []): Array<IAppNavigation> {
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig ? route.routeConfig.data['breadcrumb'] : routes.find((item: Route) => item.path === routes.find(item => item.path === '').redirectTo).data['breadcrumb'];
    const path = route.routeConfig ? route.routeConfig.path : '';
    console.log(route.routeConfig);

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    if (path !== routes.find((item: Route) => item.path === '').redirectTo) {
      const nextUrl = `${url}${path}/`;
      const breadcrumb = {
        label: label,
        url: nextUrl,
      };
      const newBreadcrumbs = [...breadcrumbs, breadcrumb];
      if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      return newBreadcrumbs;
    } else {
      return [];
    }

  }

  routeTo(url: string) {
    this._router.navigate([url]);
  }

  get navBreadcrumbs() {
    return this._navBreadcrumbs;
  }

}

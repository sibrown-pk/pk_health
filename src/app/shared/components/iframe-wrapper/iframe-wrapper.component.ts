import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-wrapper',
  templateUrl: './iframe-wrapper.component.html',
  styleUrls: ['./iframe-wrapper.component.scss']
})
export class IframeWrapperComponent implements OnInit {

  @Input('iframe-src') iframeSrc = '';

  private _currentSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this._currentSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeSrc);
  }

  get currentSrc() {
    return this._currentSrc;
  }

}

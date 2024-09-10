import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'sanitizer' })
export class SanitizerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url, type) {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(url);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(url);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(url);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(url);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}

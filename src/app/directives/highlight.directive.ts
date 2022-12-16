import { Directive, Input, SimpleChanges, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() searchInput!: string; // searchText
  @Input() content!: string; // HTML content

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  //подсветка результатов поиска
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.content) {
      return;
    }

    if(!this.searchInput || !this.searchInput.length) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.content);
      return;
    }

    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.getFormattedText()
    );
  }

  getFormattedText() {
    const regexp = new RegExp(`(${this.searchInput})`, 'gi');
    return this.content.replace(regexp, `<span style="background-color:yellow;">$1</span>`);
  }
}

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
// operators need to be imported from the operators namespace
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: [ './filter-input.component.css' ]
})
export class FilterInputComponent implements AfterViewInit {
  @Input(‘childToMaster’) masterName: string;
  
  @ViewChild('input', {static: true}) input: ElementRef | undefined;
  
  private debounceSub: Subscription | undefined;

  filterText: string = "";

  // we use this hook because we need the input to be already mounted in the DOM
  ngAfterViewInit() {
    // we create an observable to catch all keystrokes from the input
    // @Abril, @Lucian: the same approach can be applied to Select inputs 
    this.debounceSub = fromEvent(this.input?.nativeElement, 'keypress') 
      // pipe allows us to use operators on every event
      .pipe(
        // remove falsy values
        filter(Boolean),
        // 300 miliseconds debounce time
        debounceTime(300),
        // do not fire until new content
        distinctUntilChanged(),
      )
      .subscribe((e: any) => console.log(e.target.value));
  }

  // prevent memory leaks
  OnDestroy() {
    /**
     * in this scenario, there are no possible memory leaks because the component isn't mounted at this point,
     * but it is always a good practice to unsibscribe. */
    this.debounceSub?.unsubscribe();
  }
}
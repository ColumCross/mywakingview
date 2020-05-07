import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

// Here is the tutorial to get the timelapse to work:
// https://ng-bootstrap.github.io/#/components/carousel/examples

export interface TimelapseData {
  posts: any
}

@Component({
  selector: 'app-timelapse',
  templateUrl: './timelapse.component.html',
  styleUrls: ['./timelapse.component.less']
})
export class TimelapseComponent {

  posts;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TimelapseData) { 
    this.posts = data.posts;
  }

  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }




}

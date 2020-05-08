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

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  posts;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TimelapseData) { 
    this.posts = data.posts;
  }

}
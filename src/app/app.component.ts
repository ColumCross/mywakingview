import { Component, OnChanges, OnInit, Input, Inject } from '@angular/core';
import { ApiService } from './api.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import {TimelapseComponent} from './timelapse/timelapse.component';
import {TimeGraphComponent} from './time-graph/time-graph.component';
// import { resolve } from 'dns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  // Global Variables
  title = 'mywakingview';
  allPosts = [];
  finishedLoading: boolean = false;
  locationhashmap = {
    albany: 0,
    annapolis: 0,
    athens: 0,
    buffalo: 0,
    henrietta: 0,
    rockport: 0,
    toronto: 0
  }
  // Button labels
  timegraphText = "When I Awoke";
  timelapseText = "Timelapse";
  mapdialogText = "Where I Awoke";
  loadingText = "Loading...";
  timegraphLabel = this.timegraphText;
  timelapseLabel = this.timelapseText;
  mapLabel = this.mapdialogText;

  times = [];

  // Initialization Functions

  constructor(private apiService: ApiService, public dialog: MatDialog) { }
	ngOnInit() {
    console.log("Is it really bad form to leave in logs, if they are truly informative and pertinent to the application?\nI mean even Angular does it.");
    this.getPosts(null); 
  }

  /**
   * Goes through all pages of posts and adds them to the master list.
   * When finished reverses the list, so that the list is in chronological order, then tells the app that it has finished loading.
   * @param endCursor Identifies the next page of posts.
   */
  getPosts(endCursor) {
    this.apiService.getPosts(endCursor).subscribe((data: {graphql})=>{
      const x = data;
      var pageData = x.graphql.hashtag.edge_hashtag_to_media;
      this.allPosts.push.apply(this.allPosts, this.getOnePage(pageData.edges));
      if(pageData.page_info.has_next_page == true) {
        this.getPosts(pageData.page_info.end_cursor);
      } else {
        this.allPosts = this.allPosts.reverse();
        console.log("All #mywakingview posts:", this.allPosts);
        this.finishedLoading = true;
      }
    });
  }
  /**
   * Goes through a list of instagram posts and removes those not posted by me.
   * @param posts An array of instagram posts
   */
  getOnePage(posts) {
    var returnable = [];
    const columID = "11158353719";

    posts.forEach(post => {
      if(post.node.owner.id == columID) {
        returnable.push(this.buildPostObj(post))
      }
    });

    return returnable;
  }
  /**
   * Takes all the relevant information for an instagram post and turns it into an object readable by the app.
   * @param postinfo The details provided by instagram for one post.
   */
  private buildPostObj(postinfo) {
    const caption = postinfo.node.edge_media_to_caption.edges[0].node.text
      const captionparts = caption.split("\n").reverse();
      const location = captionparts[1];

      // Determine the correct map image to use.
      // If this seems convoluted, it's because I didn't normalize my data.
      var image = "assets/mapimgs/";
      if(location.includes("Albany") || location.includes("Guilderland")) {
        image += "albany.png";
        this.locationhashmap.albany++;
      } else if(location.includes("Annapolis")) {
        image += "annapolis.png";
        this.locationhashmap.annapolis++;
      } else if(location.includes("Athens")) {
        image += "athens.png";
        this.locationhashmap.athens++;
      } else if(location.includes("Buffalo")) {
        image += "buffalo.png";
        this.locationhashmap.buffalo++;
      } else if(location.includes("Henrietta")) {
        image += "henrietta.png";
        this.locationhashmap.henrietta++;
      } else if(location.includes("Rockport") || location.includes("Islands")) {
        image += "rockport.png";
        this.locationhashmap.rockport++;
      } else if(location.includes("Toronto")) {
        image += "toronto.png";
        this.locationhashmap.toronto++;
      } else {
        image += "blankmap.PNG";
      }

      // Split up the time and date.
      const timeparts = captionparts[2].split(" ");
      const time = timeparts[1];
      this.times.push(time); // Add the time to a big list for the graph dialog.


      return {
        imageURL: postinfo.node.display_url,
        datetime: captionparts[2],
        date: timeparts[0],
        time: time,
        location: location,
        fullcaption: caption,
        mapimage: image
      };
  }
  //////////////////////////////////////////

  /**
   * Presents the details of one post in a modal.
   * @param post The post to show details for.
   */
  showDetails(post) {
    
    console.log("Selected post:", post);

    // const scrollStrategy = this.dialog.scrollStrategies.reposition();
    this.dialog.open(ImageDialog, {
      data: {
        post: post,
        locations: null
      },
      maxHeight: '90vh'
    })
  }

  /**
   * Opens a dialog showing where I woke up.
   */
  openLocationDialog() {
    this.mapLabel = this.loadingText;
    this.dialog.open(LocationDialog, {
      data: {
        post: null,
        locations: this.locationhashmap
      },
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      this.mapLabel = this.mapdialogText;
    });
  }

  /**
   * Opens a dialog showing a component that contains a timelapse of all the posts.
   */
  public openTimelapse() {
    this.timelapseLabel = this.loadingText;
    this.dialog.open(TimelapseComponent, {
      data: {
        posts: this.allPosts
      },
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      this.timelapseLabel = this.timelapseText;
    });
  }

  /**
   * Opens a bar chart showing when I woke up.
   */
  public openTimeGraph() {
    this.timegraphLabel = this.loadingText;
    this.dialog.open(TimeGraphComponent, {
      data: {
        times: this.times
      },
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      this.timegraphLabel = this.timegraphText;
    });
  }


}

export interface DialogData {
  post: any,
  locations: any
}


// Dialog Classes.

@Component({
  selector: 'image-dialog',
  templateUrl: 'image-dialog.html',
})
export class ImageDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'locations-dialog',
  templateUrl: 'locations-dialog.html',
})
export class LocationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  map = "blankmap.PNG"
}
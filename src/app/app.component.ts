import { Component, OnChanges, OnInit, Input, Inject } from '@angular/core';
import { ApiService } from './api.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { resolve } from 'dns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'mywakingview';
  allPosts = [];
  finishedLoading: boolean = false;

  constructor(private apiService: ApiService, public dialog: MatDialog) { }
	ngOnInit() {
    this.getPosts(null); 
  }

  
  getPosts(endCursor) {
    this.apiService.getPosts(endCursor).subscribe((data: {graphql})=>{
      var gay = data;
      var pageData = gay.graphql.hashtag.edge_hashtag_to_media;
      this.allPosts.push.apply(this.allPosts, this.getOnePage(pageData.edges));
      if(pageData.page_info.has_next_page == true) {
        this.getPosts(pageData.page_info.end_cursor);
      } else {
        this.allPosts = this.allPosts.reverse();
        console.log(this.allPosts);
        this.finishedLoading = true;
      }
    });
  }

  getOnePage(posts) {
    var returnable = [];
    const columID = "11158353719";

    posts.forEach(post => {
      if(post.node.owner.id == columID) {
        const caption = post.node.edge_media_to_caption.edges[0].node.text
        const captionparts = caption.split("\n").reverse();
        returnable.push({
          imageURL: post.node.display_url,
          datetime: captionparts[2],
          location: captionparts[1],
          fullcaption: caption
        });
      }
    });

    return returnable;
  }

  showDetails(post) {
    
    console.log(post);
  }

  openDialog() {
    this.dialog.open(LocationDialog, {
      data: {
        test: "Test"
      }
    })
  }


}

export interface DialogData {
  test: string
}

@Component({
  selector: 'locations-dialog',
  templateUrl: 'locations-dialog.html',
})
export class LocationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  instagramURL = "https://www.instagram.com/explore/tags/mywakingview/?__a=1";

  constructor(private httpClient: HttpClient) { }

  public getPageOnePosts(){
    return this.httpClient.get(this.instagramURL);
  }
  public getPosts(end_cursor?) {
    var url = end_cursor ? this.instagramURL + "&max_id=" + end_cursor : this.instagramURL
    return this.httpClient.get(url);

  }
}

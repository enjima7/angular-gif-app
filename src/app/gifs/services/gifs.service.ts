import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = '6TLTfkA1X5vY0KF1gNZrHnN58jCNlDAg';
  private servirceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log("Gifs Service ready")
   }

  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private organizeHistory(tag: string){
    tag = tag.toLocaleLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStrorage();
  }

  private saveLocalStrorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if( !localStorage.getItem('history') ) return;

   this._tagsHistory = JSON.parse(localStorage.getItem('history') !);

   if( this._tagsHistory.length === 0) return;

   this.searchTag( this._tagsHistory[0]);
  }

  searchTag(tag:string): void{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q',tag)

    this.http.get<SearchResponse>(`${this.servirceUrl}/search`,{params})
    .subscribe(resp => {

      this.gifList = resp.data;

    });

  }



}

import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService {
  public url: string;
  public identity;
  public token;

  constructor(private _http: HttpClient){
      this.url = GLOBAL.url;
  }

  getSongs(token, albumId=null) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    if (albumId == null) {
      return this._http.get(`${this.url}songs`, {headers});
    } else {
      return this._http.get(`${this.url}songs/${albumId}`, {headers});
    }
  }

  getSong(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(`${this.url}song/${id}`, {headers});
  }

  addSong(token, song:Song) {
    let params = JSON.stringify(song);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(`${this.url}song`, params, {headers});
  }

  editSong(token,id, song:Song) {
    let params = JSON.stringify(song);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(`${this.url}song/${id}`, params, {headers});
  }

  deleteSong(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.delete(`${this.url}song/${id}`, {headers});
  }

}

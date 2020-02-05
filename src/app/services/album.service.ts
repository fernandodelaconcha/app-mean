import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
  public url: string;
  public identity;
  public token;

  constructor(private _http: HttpClient){
      this.url = GLOBAL.url;
  }

  getAlbums(token, artistId=null) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    if (artistId == null) {
      return this._http.get(`${this.url}albums`, {headers});
    } else {
      return this._http.get(`${this.url}albums/${artistId}`, {headers});
    }
  }

  getAlbum(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(`${this.url}album/${id}`, {headers});
  }

  addAlbum(token, album:Album) {
    let params = JSON.stringify(album);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(`${this.url}album`, params, {headers});
  }

  editAlbum(token,id, album:Album) {
    let params = JSON.stringify(album);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(`${this.url}album/${id}`, params, {headers});
  }

  deleteAlbum(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.delete(`${this.url}album/${id}`, {headers});
  }

}

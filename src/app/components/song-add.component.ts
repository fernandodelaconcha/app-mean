import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Song } from '../models/song'
import { UserService } from '../services/user.services';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService, AlbumService, SongService]
})
export class SongAddComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url:string;
    public alertMessage;
    public song: Song;
    public albumTitle;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ){
        this.title = 'Add Song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',1,'', '', '', '');
    }
    ngOnInit() {
        this._route.params.forEach((params: Params)=>{
            let album_id = params['album'];
            this.song.album = album_id;
        })
        this._albumService.getAlbum(this.token, this.song.album).subscribe(response => {
            let res:any = response;
            if(res.album) this.albumTitle = res.album.title
        },
        error => {
            console.log(error)
        })
    }
    onSubmit(){
        this._songService.addSong(this.token, this.song).subscribe(response=>{
            let res:any = response;
            let song = res.song;
            if (!song){
                this.alertMessage = 'oops, server error'
            } else {
                this.alertMessage = 'song added succesfully'
                this.song = song;
                this._router.navigate(['/edit-song', this.song._id])
            }
        },
        error => {
            if (error != null){
                this.alertMessage =error.error.message;
            }
          });
    }
}

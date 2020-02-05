import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { UserService } from '../services/user.services';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';


@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService]
})
export class AlbumDetailComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url:string;
    public album: Album;
    public alertMessage;
    public songs: Array<Song>;
    public confirm;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }
    ngOnInit() {
    this.getAlbum()
    }
    getAlbum() {        
        this._route.params.forEach((param: Params) => {
            let id = param['id'];

            this._albumService.getAlbum(this.token, id).subscribe(response => {
                let res:any = response;
                let album = res.album;

                if (!album) {
                    this._router.navigate(['/']);
                } else {
                    this.album = album;
                    this._songService.getSongs(this.token, album._id).subscribe(response => {
                        let res:any = response;
                        let songs = res.songs;

                        if (!songs) {
                            this.alertMessage = 'this artist does not have any album yet'
                        } else {
                            this.songs = songs;
                        }
                    },
                    error => {
                        if (error != null){
                            alert(error.error.message);
                        }
                    });
                }
            },
            error => {
                if (error != null){
                    alert(error.error.message);
                }
              });
        })
    }
    onDeleteConfirm (id) {
        this.confirm = id;
    }
    onCancelSong (){
        this.confirm = null;
    }
    onDeleteSong (id) {
        this._songService.deleteSong(this.token, id).subscribe(response => {
            let res:any = response;
            let album = res.album;

            if (!album) {
                console.log('error deleting song');
                
            } else {
                this.getAlbum();
            }
        },
        error => {
            if (error != null){
                alert(error.error.message);
            }
          });
    }
    startPlayer(song){
       let songPlayer = JSON.stringify(song);
       let filePath = this.url + 'get-song-file/' + song.file;
       let imagePath = this.url + 'get-image-album/' + song.album.image;

       localStorage.setItem('currentSong', songPlayer);
       

       document.getElementById('mp3-source').setAttribute('src', filePath);
       (document.getElementById("player") as any).load();
       (document.getElementById("player") as any).play();

       
       document.getElementsByClassName('play-song-title')[0].innerHTML = song.name;
       document.getElementsByClassName('play-song-artist')[0].innerHTML = song.album.artist.name;
       document.getElementById('play-image-album').setAttribute('src', imagePath);
    }
}

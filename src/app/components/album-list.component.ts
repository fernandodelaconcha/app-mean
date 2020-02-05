import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { UserService } from '../services/user.services';
import { Album } from '../models/album';


@Component({
  selector: 'album-list',
  templateUrl: '../views/album-list.html',
  providers: [AlbumService, UserService]
})
export class AlbumListComponent implements OnInit{
    public title: string;
    public albums: Array<Album>;
    public identity;
    public token;
    public url:string;
    public nextPage;
    public prevPage;
    public confirm;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ){
        this.title = 'Albums';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.nextPage=1;
        this.prevPage=1;
    }
    ngOnInit() {
        this.getAlbums()
    }

    getAlbums(){
        this._albumService.getAlbums(this.token)
        .subscribe(
            response => {
                let res:any = response;
                let albums = res.albums;
                if (!albums){
                    console.log('oops, server error')
                } else {
                    this.albums = albums;
                }
            },
            error => {
                if (error != null){
                    console.log(error.error.message);
                }
                });
    }
    onDeleteConfirm (id) {
        this.confirm = id;
    }
    onCancelAlbum (){
        this.confirm = null;
    }
    onDeleteAlbum (id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(response => {
            let res:any = response;
            let album = res.album;

            if (!album) {
                console.log('error deleting album');
                
            } else {
                this.getAlbums();
            }
        },
        error => {
            if (error != null){
                alert(error.error.message);
            }
          });
    }
}

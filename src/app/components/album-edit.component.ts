import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';
import { UserService } from '../services/user.services';
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [AlbumService, UserService, UploadService]
})
export class AlbumEditComponent implements OnInit{
    public name: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url;
    public alertMessage;
    public filesToUpload: Array<File>;
    public is_edit;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ){
        this.name = 'Edit album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','',2020,'','');
        this.is_edit = true;
    }
    ngOnInit() {
        this._route.params.forEach((param: Params) => {
            let id = param['id'];

            this._albumService.getAlbum(this.token, id).subscribe(response => {
                let res:any = response;
                let album = res.album;

                if (!album) {
                    this._router.navigate(['/']);
                } else {
                    this.album = album;
                }
            },
            error => {
                if (error != null){
                    this.alertMessage =error.error.message;
                }
              });
        })
    }

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;
        })        
        this._albumService.editAlbum(this.token, this.album._id, this.album).subscribe(response=>{
            let res:any = response;
            let album = res.album;
            if (!album){
                this.alertMessage = 'oops, server error'
            } else {
                this.alertMessage = 'album edited succesfully'
                this.album = album;
                this._uploadService.makeFileRequest(`${this.url}upload-image-album/${this.album._id}`, [],this.filesToUpload, this.token, 'null')
                    .then(result => {
                        this._router.navigate(['/edit-album', this.album._id])
                    }, 
                    error => {
                        console.log(error)
                    })
            }
        },
        error => {
            if (error != null){
                this.alertMessage =error.error.message;
            }
          });
    }
    fileChangeEvent (fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [ArtistService, UserService, UploadService]
})
export class ArtistEditComponent implements OnInit{
    public title: string;
    public artists: Array<Artist>;
    public identity;
    public token;
    public url:string;
    public artist: Artist;
    public alertMessage;
    public filesToUpload: Array<File>;
    public is_edit;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ){
        this.title = 'Edit artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','', '');
        this.is_edit = true;
    }
    ngOnInit() {
    this.getArtist()
    }
    getArtist() {
        this._route.params.forEach((param: Params) => {
            let id = param['id'];

            this._artistService.getArtist(this.token, id).subscribe(response => {
                let res:any = response;
                let artist = res.artist;

                if (!artist) {
                    this._router.navigate(['/']);
                } else {
                    this.artist = artist;
                }
            },
            error => {
                if (error != null){
                    this.alertMessage =error.error.message;
                }
              });
        })
    }
    onSubmit () {
        this._route.params.forEach((param: Params) => {
            let id = param['id'];
            this._artistService.editArtist(this.token, id, this.artist).subscribe(response=>{
                let res:any = response;
                let artist = res.artist;
                if (!artist){
                    this.alertMessage = 'oops, server error';
                } else {
                    this.alertMessage = 'artist edited succesfully';
                    if (!this.filesToUpload){
                        this._router.navigate(['/artist', artist._id])
                    } else {
                        this._uploadService.makeFileRequest(`${this.url}upload-image-artist/${id}`, [],this.filesToUpload, this.token, 'null')
                        .then(result => {
                        this._router.navigate(['/artist', artist._id])
                        }, 
                        error => {
                            console.log(error)
                        })
                    }
                }
            },
            error => {
                if (error != null){
                    this.alertMessage =error.error.message;
                }
              });
        })
    }
    fileChangeEvent (fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}

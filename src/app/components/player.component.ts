import {Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'player',
    template: `
    <div class="album-image">
        <span *ngIf="song.album">
            <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}">
        </span>
        <span *ngIf="!song.album" class="play-image-album">
            <img id="play-image-album" src="assets/images/default.jpg">
        </span>
    </div>

    <div class="audio-file">
        <p>Playing - <span class="play-song-title">{{song.name}}</span></p>
        <p><span class="play-song-artist" *ngIf="song.artist">{{song.album.artist.name}}</span></p>
        <p><span class="play-song-artist" *ngIf="!song.artist"></span></p>
        <audio controls id="player">
            <source id="mp3-source" src="{{url +get-song-file/ + song.file}}" type="audio/mpeg">
            Your browser does not support audio
        </audio>
    <div>
    `
})


export class PlayerComponent implements OnInit {
public url: string;
public song: Song;

constructor () {
    this.url = GLOBAL.url;
    this.song = new Song('',1,'','','','');
}

    ngOnInit() {
        var song = JSON.parse(localStorage.getItem('currentSong'));
        
        if (song){
            this.song = song;
        } else {
            this.song = new Song('',1,'','','','');
        }
    }
}
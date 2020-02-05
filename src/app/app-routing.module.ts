import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { AlbumListComponent } from './components/album-list.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artists/:page?', component: ArtistListComponent},
  {path: 'artist/:id', component: ArtistDetailComponent},
  {path: 'add-artist', component: ArtistAddComponent},
  {path: 'edit-artist/:id', component: ArtistEditComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'albums', component: AlbumListComponent},
  {path: 'create-album/:artist', component: AlbumAddComponent},
  {path: 'edit-album/:id', component: AlbumEditComponent},
  {path: 'add-song/:album', component: SongAddComponent},
  {path: 'edit-song/:id', component: SongEditComponent},
  {path: 'my-data', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

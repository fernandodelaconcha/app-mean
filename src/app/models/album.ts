export class Album {
    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public year: number,
        public img: string,
        public artist: string
    ){}
}
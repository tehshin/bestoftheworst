export class Image {
    id: string;
    imageUrl: string;
}

export class Movie {
    id: number;
    title: string;
    synopsis: string;
    image: Image;
}

export class MovieForm {
    title: string;
    synopsis: string;
    image: string;
}
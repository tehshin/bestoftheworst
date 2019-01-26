interface MovieDbMovie {
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    title: string;
    id: number;
}

interface MovieDbSearchResult {
    page: number;
    results: MovieDbMovie[];
    total_pages: number;
    total_results: number;
}

interface MovieDbDetails {
    backdrop_path: string;
    genres: any;
    homepage: string;
    id: number;
    imdb_id: string | null;
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number | null;
    title: string;
}

export { MovieDbMovie, MovieDbSearchResult, MovieDbDetails };


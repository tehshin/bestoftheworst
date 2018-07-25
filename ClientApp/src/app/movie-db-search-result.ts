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

export { MovieDbMovie, MovieDbSearchResult };

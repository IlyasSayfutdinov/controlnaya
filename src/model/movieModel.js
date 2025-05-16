export class MovieModel {
    constructor() {
        this.movies = [];
    }

    addMovie(title, watched = false) {
        const movie = { id: Date.now(), title, watched, favorite: false };
        this.movies.push(movie);
    }

    deleteMovie(id) {
        this.movies = this.movies.filter(m => m.id !== id);
    }

    updateMovie(id, data) {
        const movie = this.movies.find(m => m.id === id);
        if (movie) Object.assign(movie, data);
    }

    getMovieById(id) {
        return this.movies.find(m => m.id === id);
    }

    getMovies(filter = 'all', favoriteOnly = false) {
        return this.movies.filter(m => {
            const statusMatch = filter === 'all' ||
                (filter === 'watched' && m.watched) ||
                (filter === 'unwatched' && !m.watched);
            const favoriteMatch = !favoriteOnly || m.favorite;
            return statusMatch && favoriteMatch;
        });
    }
}
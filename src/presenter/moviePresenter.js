export class MoviePresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddMovie(this.handleAdd.bind(this));
        this.view.bindDeleteMovie(this.handleDelete.bind(this));
        this.view.bindToggleWatched(this.handleToggle.bind(this));
        this.view.bindFilters(this.render.bind(this));

        this.render();
    }

    handleAdd(title, watched) {
        this.model.addMovie(title, watched);
        this.render();
    }

    handleDelete(id) {
        this.model.deleteMovie(id);
        this.render();
    }

    handleToggle(id) {
        const movie = this.model.getMovieById(id);
        if (movie) {
            this.model.updateMovie(id, { watched: !movie.watched });
            this.render();
        }
    }

    render() {
        const filter = this.view.getSelectedFilter();
        const favorite = this.view.isFavoriteOnly();
        const movies = this.model.getMovies(filter, favorite);
        this.view.renderMovies(movies);
    }
}
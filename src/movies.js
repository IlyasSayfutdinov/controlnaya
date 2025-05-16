// ===== Model =====
class MovieModel {
    constructor() {
        this.movies = [];
    }

    addMovie(title, watched = false) {
        const movie = {
            id: Date.now(),
            title,
            watched,
            favorite: false,
        };
        this.movies.push(movie);
        return movie;
    }

    deleteMovie(id) {
        this.movies = this.movies.filter(movie => movie.id !== id);
    }

    updateMovie(id, data) {
        const movie = this.movies.find(movie => movie.id === id);
        if (movie) {
            Object.assign(movie, data);
        }
    }

    getMovies(filter = 'all', favoriteOnly = false) {
        return this.movies.filter(movie => {
            let statusMatch = filter === 'all' ||
                (filter === 'watched' && movie.watched) ||
                (filter === 'unwatched' && !movie.watched);
            let favoriteMatch = !favoriteOnly || movie.favorite;
            return statusMatch && favoriteMatch;
        });
    }

    getMovieById(id) {
        return this.movies.find(movie => movie.id === id);
    }
}

// ===== View =====
class MovieView {
    constructor() {
        this.form = document.getElementById('movie-form');
        this.titleInput = document.getElementById('movie-title');
        this.statusInput = document.getElementById('movie-status');
        this.movieList = document.getElementById('movie-list');

        this.statusFilters = document.querySelectorAll('input[name="status-filter"]');
        this.favoriteFilter = document.getElementById('favorite-filter');
    }

    bindAddMovie(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            handler(this.titleInput.value, this.statusInput.checked);
            this.form.reset();
        });
    }

    bindDeleteMovie(handler) {
        this.movieList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete')) {
                const id = +e.target.closest('.card').dataset.id;
                handler(id);
            }
        });
    }

    bindEditMovie(handler) {
        this.movieList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                const card = e.target.closest('.card');
                const id = +card.dataset.id;
                const newTitle = prompt('Введите новое название фильма:');
                if (newTitle) {
                    handler(id, { title: newTitle });
                }
            }
        });
    }

    bindToggleWatched(handler) {
        this.movieList.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-status')) {
                const id = +e.target.closest('.card').dataset.id;
                handler(id);
            }
        });
    }

    bindFilters(handler) {
        this.statusFilters.forEach(radio =>
            radio.addEventListener('change', () => handler())
        );
        this.favoriteFilter.addEventListener('change', () => handler());
    }

    renderMovies(movies) {
        this.movieList.innerHTML = '';

        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = `card ${movie.watched ? 'watched' : ''}`;
            card.dataset.id = movie.id;

            card.innerHTML = `
                <div class="card-title">${movie.title}</div>
                <div class="card-details">Статус: ${movie.watched ? 'Просмотрен' : 'Не просмотрен'}</div>
                <button class="toggle-status">Изменить статус</button>
                <button class="edit">Редактировать</button>
                <button class="delete">Удалить</button>
            `;

            this.movieList.appendChild(card);
        });
    }

    getSelectedFilter() {
        const selected = document.querySelector('input[name="status-filter"]:checked');
        return selected ? selected.value : 'all';
    }

    isFavoriteOnly() {
        return this.favoriteFilter.checked;
    }
}

// ===== Presenter =====
class MoviePresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddMovie(this.handleAddMovie.bind(this));
        this.view.bindDeleteMovie(this.handleDeleteMovie.bind(this));
        this.view.bindEditMovie(this.handleEditMovie.bind(this));
        this.view.bindToggleWatched(this.handleToggleWatched.bind(this));
        this.view.bindFilters(this.render.bind(this));

        this.render();
    }

    handleAddMovie(title, watched) {
        this.model.addMovie(title, watched);
        this.render();
    }

    handleDeleteMovie(id) {
        this.model.deleteMovie(id);
        this.render();
    }

    handleEditMovie(id, data) {
        this.model.updateMovie(id, data);
        this.render();
    }

    handleToggleWatched(id) {
        const movie = this.model.getMovieById(id);
        if (movie) {
            this.model.updateMovie(id, { watched: !movie.watched });
            this.render();
        }
    }

    render() {
        const filter = this.view.getSelectedFilter();
        const favoriteOnly = this.view.isFavoriteOnly();
        const movies = this.model.getMovies(filter, favoriteOnly);
        this.view.renderMovies(movies);
    }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new MoviePresenter(new MovieModel(), new MovieView());
});

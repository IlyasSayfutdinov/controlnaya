export class MovieView {
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

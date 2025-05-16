import { MovieModel } from './model/movieModel.js';
import { MovieView } from './view/movieView.js';
import { MoviePresenter } from './presenter/moviePresenter.js';

document.addEventListener('DOMContentLoaded', () => {
    new MoviePresenter(new MovieModel(), new MovieView());
});
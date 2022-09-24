import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = "We couldn't find this recipe. Please try again!";

  _generateMarkUp() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(el => {
        return `
              <li class="preview ${
                id === el.id ? 'preview__link--active' : ''
              }">
                      <a
                        class="preview__link"
                        href="#${el.id}"
                      >
                        <figure class="preview__fig">
                          <img src=${el.image} alt="Test" />
                        </figure>
                        <div class="preview__data ">
                          <h4 class="preview__title"> ${el.title} </h4>
                          <p class="preview__publisher">${el.publisher}</p>
                          <div class="recipe__user-generated ${
                            el.key ? '' : 'hidden'
                          }">
                            <svg>
                              <use href="${icons}#icon-user"></use>
                            </svg>
                          </div>
                        </div>
                      </a>
                    </li>
              `;
      })
      .join('');
  }
}

export default new ResultsView();

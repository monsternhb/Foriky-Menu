// 1. Render pagination follow by page

// add listener click end then get number of page and then render that page
import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkUp() {
    const curPage = this._data.page;
    const numberPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and more than 1 page
    if (curPage === 1 && numberPage > 1)
      return this._generateRightBtn(curPage + 1);

    // on last page
    if (curPage === numberPage) return this._generateLeftBtn(curPage - 1);

    // between many pages
    if (curPage < numberPage) {
      const btnLeft = this._generateLeftBtn(curPage - 1);
      const btnRight = this._generateRightBtn(curPage + 1);
      return btnLeft + '' + btnRight;
    }

    // only 1 page
    return '';
  }

  _generateLeftBtn(pageNumber) {
    return `<button data-goTo = "${pageNumber}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${pageNumber}</span>
  </button>`;
  }

  _generateRightBtn(pageNumber) {
    return `<button data-goTo = "${pageNumber}" class="btn--inline pagination__btn--next">
    <span>Page ${pageNumber}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
    `;
  }
}

export default new PaginationView();

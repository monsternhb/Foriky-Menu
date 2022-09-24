import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overLay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _message = 'Upload done!!!';
  addHandlerAddRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // ["key","value"]
      const data = Object.fromEntries(dataArr); // covert to object
      handler(data);
    });
  }

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }

  toogleForm() {
    this._overLay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerOpenWindow() {
    debugger;
    this._btnOpen.addEventListener('click', this.toogleForm.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toogleForm.bind(this));
    this._overLay.addEventListener('click', this.toogleForm.bind(this));
  }
}

export default new AddRecipeView();

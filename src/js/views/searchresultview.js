import View from './view.js';
import previewView from './previewview.js';
import icons from 'url:../../img/icons.svg';

class SearchResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again! 🔥';
  _successMessage = 'Recipe successfully added to your bookmarks!';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultView();

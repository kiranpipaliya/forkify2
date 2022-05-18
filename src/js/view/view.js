import icons from "../../img/icons.svg";  //parcel 2 

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.randerError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clean();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clean() {
    this._parentElement.innerHTML = "";
  }

  renderSpiner = function () {

    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
            `
    this._clean();
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }




  randerError(message = this._errorMessage) {

    const markup = `
        <div class="error">
           <div>
            <svg>
              <use href="${icons}.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
            `
    this._clean();
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }

  message(message = this._message) {
    const markup = `
        <div class="message">
           <div>
            <svg>
              <use href="${icons}.svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
            `
    this._clean();
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }
} 
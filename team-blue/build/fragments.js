(function () {
  'use strict';

  function renderBasket(count) {
    const classname = count === 0 ? 'empty' : 'filled';
    return `<div class="${classname}">basket: ${count} item(s)</div>`;
  }

  /* eslint-disable no-use-before-define, no-console, class-methods-use-this */

  class BlueBasket extends HTMLElement {
    connectedCallback() {
      this.refresh = this.refresh.bind(this);
      this.log('connected');
      this.render();
      window.addEventListener('blue:basket:changed', this.refresh);
    }

    refresh() {
      this.log('event recieved "blue:basket:changed"');
      this.render();
    }

    render() {
      this.innerHTML = renderBasket(window.blue.count);
    }

    disconnectedCallback() {
      window.removeEventListener('blue:basket:changed', this.refresh);
      this.log('disconnected');
    }

    log(...args) {
      console.log('🛒 blue-basket', ...args);
    }
  }

  const prices = {
    t_porsche: '66,00 €',
    t_fendt: '54,00 €',
    t_eicher: '58,00 €',
  };

  function renderBuy(sku = 't_porsche') {
    const price = prices[sku];
    return `<button type="button">buy for ${price}</button>`;
  }

  /* eslint-disable no-use-before-define, no-console, class-methods-use-this */

  class BlueBuy extends HTMLElement {
    static get observedAttributes() {
      return ['sku'];
    }

    connectedCallback() {
      this.addToCart = this.addToCart.bind(this);
      const sku = this.getAttribute('sku');
      this.log('connected', sku);
      this.render();
      this.firstChild.addEventListener('click', this.addToCart);
    }

    addToCart() {
      window.blue.count += 1;
      this.log('event sent "blue:basket:changed"');
      this.dispatchEvent(new CustomEvent('blue:basket:changed', {
        bubbles: true,
      }));
    }

    render() {
      const sku = this.getAttribute('sku');
      this.innerHTML = renderBuy(sku);
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      this.log('attributeChanged', attr, oldValue, newValue);
      this.render();
    }

    disconnectedCallback() {
      this.firstChild.removeEventListener('click', this.addToCart);
      const sku = this.getAttribute('sku');
      this.log('disconnected', sku);
    }

    log(...args) {
      console.log('🔘 blue-buy', ...args);
    }
  }

  /* globals window */

  window.blue = { count: 0 };
  window.customElements.define('blue-basket', BlueBasket);
  window.customElements.define('blue-buy', BlueBuy);

}());

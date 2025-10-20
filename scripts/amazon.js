import {cart, addToCart, saveToStorage} from '../data/cart.js'
import {products, loadProductsFetch} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

document.addEventListener("DOMContentLoaded", async () => {
  await loadProductsFetch(); 
  renderProductsGrid();   
  updateCartQuantity();
});

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const cartQuantityEl = document.querySelector('.js-cart-quantity');
  if (cartQuantityEl) {
    cartQuantityEl.innerHTML = cartQuantity;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
};

function renderProductsGrid() {
  let productsHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLocaleLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
    });
  }
  
  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>
  
        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>
  
        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStartUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>
  
        <div class="product-price">
          $${product.getPrice()}
        </div>
  
        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
  
        ${product.extraInfoHTML()}
  
        <div class="product-spacer"></div>
  
        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>
  
        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });
  
  const grid = document.querySelector('.js-products-grid');
  if (!grid) return;
  grid.innerHTML = productsHTML;

  const addedMessageTimeouts = {};
  
  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
  
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = Number(quantitySelector.value);
  
        const addedToCartEl = document.querySelector(`.js-added-to-cart-${productId}`);
        addedToCartEl.classList.add(`added-to-cart-visible`)
        const previousTimeoutId = addedMessageTimeouts[productId];
  
        if (previousTimeoutId) {
          clearTimeout(previousTimeoutId);
        }
  
        const timeoutId = setTimeout(() => {
          addedToCartEl.classList.remove('added-to-cart-visible');
        }, 1500);
  
        addedMessageTimeouts[productId] = timeoutId;
  
        addToCart(productId, quantity);
        updateCartQuantity();
      });
    });

    const searchButton = document.querySelector('.js-search-button');
    const searchInput = document.querySelector('.js-search-bar');

    if (searchButton && searchInput) {
      searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `amazon.html?search=${encodeURIComponent(query)}`;
        }
      });


      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `amazon.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    }

}

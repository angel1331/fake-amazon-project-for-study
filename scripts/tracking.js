import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { updateCartQuantity } from "./amazon.js";

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  const order = getOrder(orderId);
  const product = getProduct(productId);
  let productDetails;

  function getURLParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }
  
  if (!orderId || !productId) {
    document.body.innerHTML = `<h1>Missing orderId or productId in URL!</h1>`;
    throw new Error('Missing parametrs');
  }
  
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });
  
  if (!order || !product) {
    document.body.innerHTML = '<h1>Order or product not found!</h1>';
    throw new Error('Data not found');
  }
  
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const trackingHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
  
      <div class="delivery-date">
        Arriving on ${dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')}
      </div>
  
      <div class="product-info">
        ${product.name}
      </div>
  
      <div class="product-info">
        Quantity: ${productDetails.quantity}
      </div>
  
      <img class="product-image" src="${product.image}">
  
      <div class="progress-labels-container">
        <div class="progress-label" ${
          percentProgress < 50 ? 'current-status' : ''
        }>
          Preparing
        </div>
        <div class="progress-label current-status" ${
          (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
        }>
          Shipped
        </div>
        <div class="progress-label" ${
          percentProgress >= 100 ? 'current-status' : ''
        }>
          Delivered
        </div>
      </div>
  
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentProgress}%;"></div>
      </div>
    </div>
  `;
  
  document.querySelector('.main').innerHTML = trackingHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartQuantity();
});

loadPage();
class VariantAddToCart {
  constructor(container) {
    this.container = container;
    this.productId = this.container.dataset.productId;
    this.variantButtons = this.container.querySelectorAll('.js-variant-select');
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.init();
  }

  init() {
    this.variantButtons.forEach((button) => {
      button.addEventListener('click', this.onVariantSelect.bind(this));
    });
  }

  onVariantSelect(event) {
    event.preventDefault();
    const variantId = event.target.dataset.variantId;

    if (event.target.classList.contains('out-of-stock')) {
      console.log('This variant is out of stock');
      return;
    }

    this.addToCart(variantId);
  }

  addToCart(variantId) {
    const formData = {
      items: [
        {
          id: variantId,
          quantity: 1,
        },
      ],
    };

    fetch(`${window.Shopify.routes.root}cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          console.error('Error adding variant to cart:', response.message);
        } else {
          this.renderCartContents(response);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  renderCartContents(response) {
    if (this.cart && typeof this.cart.renderContents === 'function') {
      this.cart.renderContents(response); // Calls the cart drawer's renderContents method
    } else if (this.cart) {
      this.cart.classList.add('is-open'); // Fallback to open the drawer if renderContents is not available
      console.log('Cart contents could be updated manually here if necessary.');
    } else {
      console.warn('Cart element not found');
    }
  }
}

// Initialize the VariantAddToCart functionality
document.addEventListener('DOMContentLoaded', () => {
  const variantContainers = document.querySelectorAll('.variant-overlay');
  variantContainers.forEach((container) => {
    new VariantAddToCart(container);
  });
});

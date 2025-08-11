
document.addEventListener('DOMContentLoaded', function() {
    const stockProducts = [
        { id: 'rect-small', name: 'Small Rectangle Tag', shape: 'rectangle', description: '3 x 5 cm tag made of durable paper.', price: 0.50 },
        { id: 'rect-large', name: 'Large Rectangle Tag', shape: 'rectangle', description: '5 x 8 cm tag made of plastic.', price: 0.75 },
        { id: 'round-medium', name: 'Medium Round Tag', shape: 'round', description: '4 cm diameter tag made of metal.', price: 1.00 },
        { id: 'oval-standard', name: 'Standard Oval Tag', shape: 'oval', description: '4 x 6 cm tag made of plastic.', price: 0.80 },
        { id: 'star-tag', name: 'Star Tag', shape: 'star', description: '5 cm star-shaped tag made of paper.', price: 0.90 }
    ];

    // Render stock products if element exists
    const stockContainer = document.getElementById('stock-products');
    if (stockContainer) {
        stockProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            // Create image placeholder using SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            const shapeElement = createShapeSVG(product.shape);
            svg.appendChild(shapeElement);
            svg.classList.add('product-image');
            card.appendChild(svg);

            const title = document.createElement('h4');
            title.textContent = product.name;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.textContent = product.description;
            card.appendChild(desc);

            const price = document.createElement('p');
            price.textContent = '$' + product.price.toFixed(2);
            card.appendChild(price);

            const button = document.createElement('button');
            button.textContent = 'Add to Cart';
            button.addEventListener('click', () => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }));
            card.appendChild(button);
            stockContainer.appendChild(card);
        });
    }

    // Cart functionality
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.getElementById('cart-button');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const closeCartButton = document.getElementById('close-cart-button');

    function getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        const cart = getCart();
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemsDiv) {
            cartItemsDiv.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `<strong>${item.name}</strong> x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)} <button data-index="${index}" class="remove">Remove</button>`;
                cartItemsDiv.appendChild(div);
                total += item.price * item.quantity;
            });
            cartTotalSpan.textContent = '$' + total.toFixed(2);
        }
    }

    function addToCart(item) {
        const cart = getCart();
        const existing = cart.find(i => i.id === item.id && i.text === item.text);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        saveCart(cart);
        updateCartDisplay();
        // Show cart when item added
        if (cartModal) cartModal.style.display = 'flex';
    }

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            updateCartDisplay();
            if (cartModal) cartModal.style.display = 'flex';
        });
    }
    if (closeCartButton) {
        closeCartButton.addEventListener('click', () => {
            if (cartModal) cartModal.style.display = 'none';
        });
    }

    // Remove items from cart
    if (cartItemsDiv) {
        cartItemsDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove')) {
                const index = parseInt(event.target.getAttribute('data-index'));
                const cart = getCart();
                cart.splice(index, 1);
                saveCart(cart);
                updateCartDisplay();
            }
        });
    }

    // Checkout placeholder
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('Checkout functionality is not implemented yet. Please contact us to place your order.');
        });
    }

    // Custom form
    const customForm = document.getElementById('custom-form');
    const customSummary = document.getElementById('custom-summary');
    if (customForm) {
        customForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(customForm);
            const shape = formData.get('shape');
            const size = parseFloat(formData.get('size'));
            const material = formData.get('material');
            const color = formData.get('color');
            const text = formData.get('text') || '';
            const quantity = parseInt(formData.get('quantity'));
            const basePrice = calculateCustomPrice(size, material);
            const totalPrice = basePrice * quantity;

            const summaryHtml = `<p>Shape: <strong>${shape}</strong></p>
                <p>Size: <strong>${size} cm</strong></p>
                <p>Material: <strong>${material}</strong></p>
                <p>Color: <span style="display:inline-block;width:16px;height:16px;background:${color};border:1px solid #ccc;"></span></p>
                <p>Text: <strong>${text}</strong></p>
                <p>Quantity: <strong>${quantity}</strong></p>
                <p>Price per tag: <strong>$${basePrice.toFixed(2)}</strong></p>
                <p>Total Price: <strong>$${totalPrice.toFixed(2)}</strong></p>`;

            if (customSummary) {
                customSummary.innerHTML = summaryHtml;
            }

            addToCart({
                id: `custom-${Date.now()}`,
                name: `${shape.charAt(0).toUpperCase() + shape.slice(1)} Custom Tag`,
                price: basePrice,
                quantity: quantity,
                text: text
            });

            customForm.reset();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    const contactResponse = document.getElementById('contact-response');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            contactResponse.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
            contactForm.reset();
        });
    }

    updateCartDisplay();

    // Helper functions
    function createShapeSVG(shape) {
        const namespace = 'http://www.w3.org/2000/svg';
        let element;
        switch(shape) {
            case 'rectangle':
                element = document.createElementNS(namespace, 'rect');
                element.setAttribute('x', '10');
                element.setAttribute('y', '10');
                element.setAttribute('width', '80');
                element.setAttribute('height', '80');
                element.setAttribute('fill', '#00796b');
                break;
            case 'round':
                element = document.createElementNS(namespace, 'circle');
                element.setAttribute('cx', '50');
                element.setAttribute('cy', '50');
                element.setAttribute('r', '40');
                element.setAttribute('fill', '#00796b');
                break;
            case 'oval':
                element = document.createElementNS(namespace, 'ellipse');
                element.setAttribute('cx', '50');
                element.setAttribute('cy', '50');
                element.setAttribute('rx', '45');
                element.setAttribute('ry', '30');
                element.setAttribute('fill', '#00796b');
                break;
            case 'star':
                element = document.createElementNS(namespace, 'polygon');
                element.setAttribute('points', '50,15 61,35 85,35 66,50 71,72 50,60 29,72 34,50 15,35 39,35');
                element.setAttribute('fill', '#00796b');
                break;
            default:
                element = document.createElementNS(namespace, 'rect');
                element.setAttribute('x', '10');
                element.setAttribute('y', '10');
                element.setAttribute('width', '80');
                element.setAttribute('height', '80');
                element.setAttribute('fill', '#00796b');
        }
        return element;
    }

    function calculateCustomPrice(size, material) {
        // Base price by material
        let base = 0.5; // default
        if (material === 'paper') base = 0.5;
        if (material === 'plastic') base = 0.8;
        if (material === 'metal') base = 1.2;
        // Add size factor
        return base + 0.1 * (size - 5);
    }
});

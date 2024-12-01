// Load product data from JSON and store it in productsData
let productsData = [];

fetch("data/productData.json")
    .then(response => response.json())
    .then(data => {
        productsData = data.products;
        console.log("Product data loaded successfully:", productsData);
    })
    .catch(error => console.error("Error loading product data:", error));

// Function to display product details based on product ID
function showProductDetail(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-type").innerText = `Type: ${product.type}`;
        document.getElementById("product-practices").innerText = product.practices;
        document.getElementById("product-environment").innerText = product.environment;

        const productImage = document.getElementById("product-image");
        productImage.src = product.image;
        productImage.alt = `${product.name} Image`;
        productImage.onerror = () => {
            productImage.src = "images/placeholder.png"; // Fallback image
            productImage.alt = "Image not available";
        };

        showScreen("product-detail-template");
    } else {
        console.error(`Product with ID "${productId}" not found.`);
    }
}

// Function to search for a product by UPC code
function searchProduct() {
    const input = document.querySelector("#home-screen input[type='text']").value.trim();
    const product = productsData.find(p => p.upc === input);

    if (product) {
        showProductDetail(product.id);
    } else {
        alert("Product not found. Please enter a valid UPC code.");
    }
}

// Function to display saved products in the library
function showLibrary() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const libraryContainer = document.getElementById("library-container");
    libraryContainer.innerHTML = "";

    if (favorites.length === 0) {
        libraryContainer.innerHTML = "<p>No saved products yet.</p>";
        return;
    }

    favorites.forEach(productId => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            const productCard = `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px;">
                    <h3>${product.name}</h3>
                    <p>${product.type}</p>
                </div>`;
            libraryContainer.innerHTML += productCard;
        }
    });

    showScreen("library-screen");
}

// Function to filter library products by type
function filterLibrary() {
    const filter = document.getElementById("filter-select").value;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const libraryContainer = document.getElementById("library-container");
    libraryContainer.innerHTML = "";

    const filteredProducts = productsData.filter(product =>
        favorites.includes(product.id) && (!filter || product.type === filter)
    );

    if (filteredProducts.length === 0) {
        libraryContainer.innerHTML = "<p>No products match this filter.</p>";
    } else {
        filteredProducts.forEach(product => {
            const productCard = `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px;">
                    <h3>${product.name}</h3>
                    <p>${product.type}</p>
                </div>`;
            libraryContainer.innerHTML += productCard;
        });
    }
}

// Function to handle adding a product to favorites with feedback
function addToFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    const checkmark = document.getElementById("favorite-checkmark");
    checkmark.style.display = "block";
    checkmark.classList.add("show");

    setTimeout(() => {
        checkmark.classList.remove("show");
        checkmark.style.display = "none";
    }, 2000);
}

// Function to display sustainability information
function showSustainabilityInfo(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product && product.attributes) {
        // Populate sustainability information
        document.getElementById("carbon-footprint").innerText = `Carbon Footprint: ${product.attributes.carbon_footprint || "N/A"}`;
        document.getElementById("materials").innerText = `Materials: ${product.attributes.materials || "N/A"}`;
        document.getElementById("certifications").innerText = `Certifications: ${product.attributes.certifications ? product.attributes.certifications.join(", ") : "N/A"}`;

        // Add link to sustainability goals
        const linkContainer = document.getElementById("sustainability-info-link");
        linkContainer.innerHTML = ""; // Clear previous links if any
        if (product.attributes.link) {
            const linkElement = document.createElement("a");
            linkElement.href = product.attributes.link;
            linkElement.target = "_blank";
            linkElement.innerText = "Learn more about sustainability here";
            linkContainer.appendChild(linkElement);
        }
    } else {
        alert("Sustainability information is missing for this product.");
    }
    showScreen("sustainability-info");
}


// Function to scan barcode with camera permission
let videoStream = null;

function scanBarcode() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            const videoElement = document.getElementById("video");
            videoElement.srcObject = stream;
            videoStream = stream;

            videoElement.play();
            showScreen("barcode-scan-screen");
            startBarcodeScan(videoElement);
        })
        .catch((error) => {
            console.error("Error accessing the camera:", error);
            alert("Unable to access the camera. Please allow camera permissions.");
        });
}

function startBarcodeScan(videoElement) {
    const canvasElement = document.createElement("canvas");
    const canvasContext = canvasElement.getContext("2d");

    function scanFrame() {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                alert(`Barcode detected: ${code.data}`);
                stopBarcodeScan();
                searchProductByUPC(code.data);
            }
        }
        requestAnimationFrame(scanFrame);
    }

    requestAnimationFrame(scanFrame);
}

function stopBarcodeScan() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    showScreen("home-screen");
}

// Function to handle feedback submission
function submitFeedback() {
    const name = document.getElementById("user-name").value.trim();
    const feedbackText = document.getElementById("feedback-text").value.trim();

    if (!name || !feedbackText) {
        alert("Please enter both your name and feedback before submitting.");
        return;
    }

    const feedbackData = { name, feedback: feedbackText };
    let storedFeedback = JSON.parse(localStorage.getItem("feedback")) || [];
    storedFeedback.push(feedbackData);
    localStorage.setItem("feedback", JSON.stringify(storedFeedback));

    const checkmark = document.getElementById("checkmark");
    checkmark.style.display = "inline-block";
    checkmark.classList.add("show");

    document.getElementById("user-name").value = "";
    document.getElementById("feedback-text").value = "";

    setTimeout(() => {
        checkmark.classList.remove("show");
        checkmark.style.display = "none";
    }, 2000);
}

// Show the specified screen
function showScreen(screenId) {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => section.style.display = "none");

    const settingsButton = document.getElementById("settings-button");
    settingsButton.style.display = screenId === "welcome-screen" ? "none" : "flex";

    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
        screenToShow.style.display = "block";
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }
}

function goBack() {
    // Navigate back to the product detail screen
    showScreen("product-detail-template");
}


// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
    showScreen("welcome-screen");
});


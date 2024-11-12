// Function to show a specific screen by ID and hide all others
function showScreen(screenId) {
    const sections = document.querySelectorAll("section");

    // Hide all sections
    sections.forEach(section => {
        section.style.display = "none";
    });

    // Show the selected screen
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
        screenToShow.style.display = "block";
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }
}

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

// Function to display the comparison screen with images and "Best Choice" label
function showComparison() {
    const simpleGreen = productsData.find(p => p.id === "simple_green");
    const seventhGen = productsData.find(p => p.id === "seventh_generation");

    if (simpleGreen) {
        const simpleGreenImage = document.getElementById("simple-green-image");
        if (simpleGreenImage) {
            simpleGreenImage.src = simpleGreen.image;
            simpleGreenImage.alt = `${simpleGreen.name} Image`;
            simpleGreenImage.onerror = () => {
                simpleGreenImage.src = "images/placeholder.png"; // Fallback image
                simpleGreenImage.alt = "Image not available";
            };
            console.log("Simple Green image set successfully.");
        } else {
            console.error("Simple Green image element not found.");
        }
    } else {
        console.error("Simple Green product data not found.");
    }

    if (seventhGen) {
        const seventhGenImage = document.getElementById("seventh-generation-image");
        if (seventhGenImage) {
            seventhGenImage.src = seventhGen.image;
            seventhGenImage.alt = `${seventhGen.name} Image`;
            seventhGenImage.onerror = () => {
                seventhGenImage.src = "images/placeholder.png"; // Fallback image
                seventhGenImage.alt = "Image not available";
            };
            console.log("Seventh Generation image set successfully.");

            // Add the "Best Choice" label dynamically to the best choice product
            const bestChoiceLabel = document.createElement("span");
            bestChoiceLabel.className = "best-choice-label";
            bestChoiceLabel.innerText = "Best Choice";

            const seventhGenTitle = document.querySelector("#product-seventh-generation h3");
            if (seventhGenTitle && !seventhGenTitle.querySelector(".best-choice-label")) {
                seventhGenTitle.appendChild(bestChoiceLabel);
                console.log("Best Choice label added to Seventh Generation.");
            }
        } else {
            console.error("Seventh Generation image element not found.");
        }
    } else {
        console.error("Seventh Generation product data not found.");
    }

    showScreen("comparison-screen");
}

// Function to handle "Add to Favorites" action with feedback confirmation
function addToFavorites() {
    const checkmark = document.getElementById("favorite-checkmark");

    checkmark.style.display = "block";
    checkmark.classList.add("show");

    setTimeout(() => {
        checkmark.classList.remove("show");
        setTimeout(() => {
            checkmark.style.display = "none";
        }, 500);
    }, 2000);
}

// Placeholder function for barcode scanning
function scanBarcode() {
    alert("Camera functionality to be implemented.");
}

// Show the welcome screen on page load
document.addEventListener("DOMContentLoaded", () => {
    showScreen("welcome-screen");
});

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
        }
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

            const bestChoiceLabel = document.createElement("span");
            bestChoiceLabel.className = "best-choice-label";
            bestChoiceLabel.innerText = "Best Choice";

            const seventhGenTitle = document.querySelector("#product-seventh-generation h3");
            if (seventhGenTitle && !seventhGenTitle.querySelector(".best-choice-label")) {
                seventhGenTitle.appendChild(bestChoiceLabel);
            }
        }
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

function searchProductByUPC(upc) {
    const product = productsData.find(p => p.upc === upc.trim());
    if (product) {
        showProductDetail(product.id);
    } else {
        alert("Product not found. Please enter a valid UPC code.");
    }
}

// Function to show the Feedback screen with name input and feedback box
function showFeedbackScreen() {
    document.getElementById('feedback-name').style.display = 'block';
    document.getElementById('feedback-text').style.display = 'block';
    document.getElementById('submit-button').style.display = 'inline-block';
    showScreen("feedback-screen");
}

// Function to handle Feedback submission with confirmation and local storage
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

    console.log("Feedback submitted:", feedbackData);

    // Show confirmation
    const checkmark = document.getElementById("checkmark");
    checkmark.style.display = "inline-block";
    checkmark.classList.add("show");

    // Reset inputs
    document.getElementById("user-name").value = "";
    document.getElementById("feedback-text").value = "";

    setTimeout(() => {
        checkmark.classList.remove("show");
        checkmark.style.display = "none";
    }, 2000);
}

// Show the home screen on page load
document.addEventListener("DOMContentLoaded", () => {
    showScreen("welcome-screen");
});

// Variable to store the previous screen
let previousScreen = null;

function showScreen(screenId) {
    const sections = document.querySelectorAll("section");

    // Hide all sections
    sections.forEach(section => {
        section.style.display = "none";
    });

    const settingsButton = document.getElementById("settings-button");
    settingsButton.style.display = screenId === "welcome-screen" ? "none" : "flex";

    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
        screenToShow.style.display = "block";
    } else {
        console.error(`Screen with ID "${screenId}" not found.`);
    }
}

// Function to go back to the previous screen
function goBack() {
    if (previousScreen) {
        showScreen(previousScreen);
    } else {
        showScreen("home-screen");
    }
}

// Usage: Update the back button on the sustainability-info screen
document.querySelector("#sustainability-info button").onclick = goBack;

// Example usage for other back buttons
document.querySelectorAll(".back-button").forEach(button => {
    button.onclick = goBack;
});

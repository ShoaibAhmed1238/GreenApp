# GreenApp

GreenApp is a web-based application designed to help users make environmentally conscious shopping choices by scanning barcodes and comparing products based on their eco-friendliness. The app displays product details, allows for comparisons, and provides insights into each product's environmental impact.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Barcode Scanning:** Quickly scan a product's barcode to view its environmental impact.
- **Product Comparison:** Compare products side-by-side, with a "Best Choice" label indicating the most eco-friendly option.
- **Favorites with Confirmation:** Add products to a favorites list with confirmation via a checkmark.
- **Transparency and Ratings:** Displays product practices and environmental ratings.
- **Interactive UI:** A clean and user-friendly interface.

## Installation
To set up GreenApp locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/greenapp.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd greenapp
   ```

3. **Install dependencies:**
   If using Node.js, install the required dependencies by running:
   ```bash
   npm install
   ```

4. **Set up the database:**
   GreenApp uses MySQL for data management. Ensure MySQL is installed and create a new database:
   ```sql
   CREATE DATABASE greenapp_db;
   ```

5. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following details:
   ```
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=greenapp_db
   ```

6. **Run the application:**
   Start the server by running:
   ```bash
   npm start
   ```

## Usage
Once the server is running, you can access GreenApp through your web browser at `http://localhost:3000`. Here are some key features:

1. **Scan Products:** Use the barcode scanning feature to view product information.
2. **Compare Products:** Select products to compare their eco-friendliness and find the best choice.
3. **Manage Favorites:** Add products to your favorites list for easy access later.
4. **View Ratings and Insights:** Understand the environmental impact of your purchases.

## File Structure
- **public/**: Contains static assets such as images, stylesheets, and JavaScript files.
- **src/**: The main source code for GreenApp.
  - **components/**: Reusable UI components.
  - **pages/**: Different pages of the application.
  - **services/**: Handles API requests and data fetching.
- **server/**: Backend server files for handling requests and managing data.
- **.env.example**: Example environment variables for configuration.

## Contributing
We welcome contributions! To contribute:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** and push to your fork:
   ```bash
   git commit -m "Add your message here"
   git push origin feature/your-feature-name
   ```
4. **Open a pull request** on the main repository.

## License
GreenApp is licensed under the MIT License. See [LICENSE](LICENSE) for more information.


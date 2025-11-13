# 🚚 Shipment Operations Dashboard

A full-stack logistics management platform that enables bulk shipment processing, real-time carrier rate comparison, and interactive map visualization.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- **📊 Bulk Data Processing**: Import hundreds of shipments via Excel files
- **💰 Real-Time Rate Comparison**: Get live quotes from DHL, FedEx, UPS, Royal Mail, and more
- **🗺️ Interactive Mapping**: Visualize shipment routes with geocoding and clustering
- **📈 Analytics Dashboard**: Track patterns and optimize logistics operations
- **🌍 Global Support**: Handle domestic and international shipping to 30+ countries

## 🚀 Live Demo

- **Frontend**: [Your GitHub Pages URL will go here]
- **Backend API**: [Your Render/Railway URL will go here]

## 🛠️ Tech Stack

### Frontend
- Vanilla JavaScript
- Leaflet.js (mapping)
- Chart.js (analytics)
- SheetJS (Excel processing)

### Backend
- Node.js & Express
- ParcelMonkey API integration
- RESTful API design
- Country-specific validation logic

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd parcelmonkey-backend

# Install dependencies
npm install

# Create .env file (optional)
echo "PM_USER_ID=your_user_id" > .env
echo "PM_API_KEY=your_api_key" >> .env

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

Simply open `Shipment Operations Dashboard.html` in a web browser, or serve it with a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server .
```

## 🔧 Configuration

### Backend Configuration

The backend can be configured via environment variables or directly in `server.js`:

```javascript
const PARCELMONKEY_CONFIG = {
    userId: process.env.PM_USER_ID || 'your_user_id',
    apiKey: process.env.PM_API_KEY || 'your_api_key',
    version: '3.1',
    baseUrl: 'https://api.parcelmonkey.co.uk'
};
```

### Frontend Configuration

Update the API endpoint in the HTML file to point to your deployed backend:

```javascript
// Find this in the HTML file
const API_URL = 'https://your-backend-url.com/api/shipping-rates';
```

## 📚 Usage

1. **Upload Excel File**: Click "Upload Excel File" and select your shipment data
2. **View on Map**: See all pickup and delivery locations visualized
3. **Get Rates**: Click on any shipment to compare carrier rates
4. **Analyze**: Use the analytics dashboard to identify patterns

### Excel File Format

Your Excel file should contain these columns:

| Column | Required | Description |
|--------|----------|-------------|
| Collection Name | Yes | Sender name |
| Collection Address | Yes | Pickup address |
| Collection Postcode | Yes | Pickup postal code |
| Collection Country | Yes | Two-letter country code (e.g., GB, US) |
| Delivery Name | Yes | Recipient name |
| Delivery Address | Yes | Delivery address |
| Delivery Postcode | Yes | Delivery postal code |
| Delivery Country | Yes | Two-letter country code |
| Weight (kg) | Yes | Package weight |

[Download Sample Excel Template](./docs/sample-template.xlsx)

## 🚀 Deployment

### Deploy Backend (Render)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `parcelmonkey-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (if needed)
7. Deploy!

### Deploy Frontend (GitHub Pages)

1. Go to your repository settings
2. Navigate to "Pages"
3. Select source: `main` branch, `/` (root)
4. Your site will be live at `https://yourusername.github.io/repo-name/`

Or use the direct HTML file URL:
```
https://yourusername.github.io/repo-name/Shipment%20Operations%20Dashboard.html
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- ParcelMonkey API for shipping rates
- Leaflet.js for mapping functionality
- Chart.js for data visualization

---

⭐ Star this repo if you find it useful!


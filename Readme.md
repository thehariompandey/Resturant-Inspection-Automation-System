# 🏪 Restaurant Inspection Automation System

A full-stack MERN application that enables restaurant administrators to create inspection checklists and automatically send them to employees via WhatsApp Flows. Employees complete inspections on WhatsApp, and responses are captured and displayed on an admin dashboard.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![WhatsApp API](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white)](https://developers.facebook.com/docs/whatsapp)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [WhatsApp Integration](#-whatsapp-integration)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 **Admin Authentication** - Secure JWT-based login system
- 🏢 **Restaurant Management** - Create and manage multiple restaurant locations
- 📍 **Section Organization** - Define inspection areas (e.g., Billing Counter, Dining Area, Washroom)
- ❓ **Dynamic Questions** - Create custom questions with multiple types (Yes/No, Number, Text)
- 📱 **WhatsApp Flow Generation** - Automatically generate interactive WhatsApp forms
- 🔔 **Automated Notifications** - Send inspection forms directly to employee phone numbers
- 📊 **Real-time Dashboard** - View and filter inspection responses by restaurant
- 🔗 **Webhook Integration** - Capture responses via WhatsApp Business API webhooks
- 🎯 **Sample Data** - Quick setup with pre-loaded sample data for testing

## 🎬 Demo

[📹 Watch Demo Video](https://www.loom.com/share/1627e2dad682410b82d7c499a78c3277)
[live link](https://my-resturant-backend.onrender.com)

**Test Credentials:**
- Email: `admin@heyopey.com`
- Password: `admin123`

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Axios** - HTTP client for WhatsApp API

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - API communication

### Integration
- **WhatsApp Business Cloud API** - Messaging and Flow creation
- **Meta Graph API** - Flow management

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Admin     │         │   Backend   │         │   WhatsApp   │
│  Dashboard  │ ◄─────► │   API       │ ◄─────► │   Business   │
│  (React)    │         │  (Express)  │         │     API      │
└─────────────┘         └─────────────┘         └──────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   MongoDB   │
                        │  Database   │
                        └─────────────┘
```

### Data Flow
1. Admin creates restaurant, sections, and questions via React UI
2. Backend stores data in MongoDB
3. Admin triggers "Send Inspection"
4. Backend creates WhatsApp Flow via Meta API
5. WhatsApp sends interactive form to employees
6. Employees complete inspection on WhatsApp
7. Webhook receives responses and stores in database
8. Dashboard displays all responses in real-time

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or Atlas account)
- WhatsApp Business Account (optional for full functionality)
- Git

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/heyopey-restaurant-inspection.git
cd heyopey-restaurant-inspection
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heyopey
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
WHATSAPP_API_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WEBHOOK_VERIFY_TOKEN=your_webhook_verification_token
```

Start backend server:

```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🚀 Usage

### 1. Login
- Navigate to `http://localhost:3000`
- Use default credentials or register new admin

### 2. Create Restaurant
- Click "Create Restaurant" tab
- Enter restaurant details or use "Load Sample Data"
- Example: McDonald's India - Jayanagar

### 3. Add Sections
- Click "Add Sections" tab
- Add inspection areas manually or use "Add Sample Sections"
- Examples: Billing Counter, Dining Area, Washroom Area

### 4. Create Questions
- Click "Add Questions" tab
- Select section and add questions with appropriate types
- Use "Add Sample Questions" for quick setup

### 5. Send Inspection
- Click "Send Inspection" tab
- Enter employee phone numbers (format: +919876543210)
- Click "Generate & Send WhatsApp Form"

### 6. View Responses
- Click "Dashboard" tab
- View all submitted responses
- Filter by restaurant

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@heyopey.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "email": "admin@heyopey.com",
    "name": "Admin User"
  }
}
```

### Restaurants

#### Get All Restaurants
```http
GET /api/restaurants
Authorization: Bearer {token}
```

#### Create Restaurant
```http
POST /api/restaurants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "McDonald's India - Jayanagar",
  "location": "Jayanagar, Bangalore"
}
```

### Sections

#### Get Sections by Restaurant
```http
GET /api/sections/restaurant/{restaurantId}
Authorization: Bearer {token}
```

#### Create Section
```http
POST /api/sections
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Billing Counter",
  "restaurant": "restaurant_id_here"
}
```

### Questions

#### Get Questions by Restaurant
```http
GET /api/questions/restaurant/{restaurantId}
Authorization: Bearer {token}
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Is billing machine working fine?",
  "type": "yes/no",
  "section": "section_id_here",
  "restaurant": "restaurant_id_here"
}
```

### WhatsApp

#### Send Inspection Form
```http
POST /api/whatsapp/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurantId": "restaurant_id_here",
  "phoneNumbers": ["+919876543210", "+919123456789"]
}
```

### Responses

#### Get All Responses
```http
GET /api/responses
Authorization: Bearer {token}
```

#### Get Responses by Restaurant
```http
GET /api/responses/restaurant/{restaurantId}
Authorization: Bearer {token}
```

## 📱 WhatsApp Integration

### Setup WhatsApp Business API

1. **Create Meta Developer Account**
   - Visit [Meta for Developers](https://developers.facebook.com)
   - Create new Business App

2. **Add WhatsApp Product**
   - In app dashboard, add WhatsApp product
   - Complete verification process

3. **Get Credentials**
   - **Access Token**: From WhatsApp > Getting Started
   - **Phone Number ID**: From test phone number section
   - **Business Account ID**: From App Settings

4. **Configure Webhook**
   - Set webhook URL: `https://your-domain.com/api/whatsapp/webhook`
   - Set verify token (same as in .env)
   - Subscribe to `messages` events

5. **Update Environment Variables**
   - Add all credentials to backend `.env` file

### WhatsApp Flow Structure

The system generates dynamic WhatsApp Flows with:
- Multiple screens (one per section)
- Dynamic form fields based on question types
- Radio buttons for Yes/No questions
- Number inputs for numeric questions
- Text inputs for open-ended questions
- Navigation between sections
- Submit functionality

### Webhook Handling

The webhook endpoint receives:
- Employee responses to inspection forms
- Message metadata (sender, timestamp)
- Flow completion data

Responses are automatically:
- Parsed and validated
- Stored in MongoDB
- Associated with correct restaurant and section
- Made available on dashboard

## 📁 Project Structure

```
heyopey-restaurant-inspection/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── Restaurant.js         # Restaurant schema
│   │   ├── Section.js            # Section schema
│   │   ├── Question.js           # Question schema
│   │   └── Response.js           # Response schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── restaurants.js        # Restaurant CRUD
│   │   ├── sections.js           # Section CRUD
│   │   ├── questions.js          # Question CRUD
│   │   ├── responses.js          # Response retrieval
│   │   └── whatsapp.js           # WhatsApp integration
│   ├── services/
│   │   └── whatsappService.js    # WhatsApp API logic
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── server.js                 # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         # Login component
│   │   │   ├── RestaurantForm.jsx
│   │   │   ├── SectionForm.jsx
│   │   │   ├── QuestionForm.jsx
│   │   │   ├── SendInspection.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/heyopey` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `WHATSAPP_API_TOKEN` | Meta access token | `EAAxxxx...` |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID | `123456789` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Business account ID | `987654321` |
| `WEBHOOK_VERIFY_TOKEN` | Webhook verification token | `my_verify_token` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 📸 Screenshots

### Admin Dashboard
![Dashboard](screenshots/dashboard.png)

### Create Restaurant
![Create Restaurant](screenshots/restaurant.png)

### Add Questions
![Questions](screenshots/questions.png)

### WhatsApp Flow
![WhatsApp](screenshots/whatsapp.png)

## 🧪 Testing

### Test Without WhatsApp API

The application fully functions for all CRUD operations without WhatsApp credentials:
- ✅ User authentication
- ✅ Restaurant management
- ✅ Section creation
- ✅ Question builder
- ✅ Dashboard viewing

WhatsApp integration will gracefully fail with informative error messages.

### Test With WhatsApp API

1. Set up valid credentials in `.env`
2. Add your phone number as test recipient in Meta dashboard
3. Send inspection form
4. Complete form on WhatsApp
5. Verify response appears on dashboard

### Manual Webhook Testing

Simulate webhook response with curl:

```bash
curl -X POST http://localhost:5000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "type": "interactive",
            "from": "919876543210",
            "interactive": {
              "type": "nfm_reply",
              "nfm_reply": {
                "response_json": "{\"q_0_0\":\"yes\",\"q_0_1\":\"yes\",\"q_0_2\":\"3\"}"
              }
            },
            "timestamp": "1234567890"
          }],
          "contacts": [{
            "profile": {"name": "Test Employee"}
          }]
        }
      }]
    }]
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check `MONGODB_URI` in `.env`
- Try using `127.0.0.1` instead of `localhost`

### WhatsApp API Errors
- Verify all credentials are correct
- Check phone number is in international format (+country code)
- Ensure webhook URL is publicly accessible (use ngrok for local testing)
- Verify webhook token matches

### CORS Errors
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running
- Verify ports are correct

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

## 🔒 Security Considerations

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Implement rate limiting for API endpoints
- Validate all user inputs on backend
- Use HTTPS in production
- Regularly rotate API tokens
- Implement proper error handling without exposing sensitive data

## 📈 Future Enhancements

- [ ] Multi-language support
- [ ] Photo upload for inspections
- [ ] Offline mode with sync
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Role-based access control
- [ ] Inspection scheduling
- [ ] Custom branding per restaurant
- [ ] Export reports to PDF/Excel
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@thehariompandey](https://github.com/thehariompandey)
- LinkedIn: [Hariom Pandey](https://www.linkedin.com/in/hariom-pandey-871694296/)
- 
## 🙏 Acknowledgments

- [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp)
- [Meta Graph API](https://developers.facebook.com/docs/graph-api)
- [React Documentation](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)


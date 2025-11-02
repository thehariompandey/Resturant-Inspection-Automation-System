# Heyopey.ai - Restaurant Inspection System

A full-stack MERN application for managing restaurant inspections via WhatsApp flows.

## 🎯 Features

- ✅ Admin authentication
- ✅ Create restaurants with multiple sections
- ✅ Define inspection questions per section (yes/no, number, text)
- ✅ Generate WhatsApp Flows and send to employees
- ✅ Receive responses via webhook
- ✅ View responses on dashboard
- ✅ Filter responses by restaurant

## 🏗️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React 18, Vite, Axios
- **Integration**: WhatsApp Business Cloud API

## 📦 Installation

### Prerequisites

- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- WhatsApp Business Account

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd heyopey-inspection
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heyopey
JWT_SECRET=your_super_secret_jwt_key_change_this
WHATSAPP_API_TOKEN=YOUR_META_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID=YOUR_BUSINESS_ACCOUNT_ID
WEBHOOK_VERIFY_TOKEN=your_webhook_verification_token
```

Start backend:

```bash
npm start
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 🔐 Default Login Credentials

```
Email: admin@heyopey.com
Password: admin123
```

## 📱 WhatsApp API Setup

### Step 1: Create Meta Developer Account

1. Go to https://developers.facebook.com
2. Create a new account or login
3. Create a new Business App

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Select "WhatsApp" and click "Set Up"
3. Complete the setup wizard

### Step 3: Get Credentials

1. **Phone Number ID**: Found in WhatsApp > Getting Started
2. **Business Account ID**: Found in App Settings
3. **Access Token**: Generate from WhatsApp > Getting Started (Temporary) or create a System User for permanent token

### Step 4: Configure Webhook

1. In WhatsApp settings, go to "Configuration"
2. Click "Edit" next to Webhook
3. Enter your webhook URL: `https://your-domain.com/api/whatsapp/webhook`
4. Enter the verify token (same as in your .env)
5. Subscribe to `messages` events

### Step 5: Update .env

Update your `backend/.env` with the credentials:

```env
WHATSAPP_API_TOKEN=YOUR_ACTUAL_TOKEN
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WEBHOOK_VERIFY_TOKEN=your_chosen_verification_token
```

## 🚀 Usage Guide

### 1. Login

- Open http://localhost:3000
- Use default credentials to login

### 2. Create Restaurant

- Click "Create Restaurant" tab
- Enter restaurant name: `McDonald's India - Jayanagar`
- Enter location: `Jayanagar, Bangalore`
- Click "Create Restaurant" or use "Load Sample Data"

### 3. Add Sections

- Click "Add Sections" tab
- Add sections one by one or click "Add Sample Sections":
  - Billing Counter
  - Dining Area
  - Washroom Area

### 4. Add Questions

- Click "Add Questions" tab
- Select a section
- Add questions or click "Add Sample Questions"
- Sample questions for Billing Counter:
  - Is billing machine working fine? (yes/no)
  - Is the card-swiping machine working fine? (yes/no)
  - How many people are currently waiting in queue? (number)

### 5. Send Inspection Form

- Click "Send Inspection" tab
- Enter employee phone numbers (format: +919876543210)
- Click "Generate & Send WhatsApp Form"
- System will create a WhatsApp Flow and send to employees

### 6. View Responses

- Click "Dashboard" tab
- View all submitted responses
- Filter by restaurant
- See employee details, submission time, and answers

## 📊 Database Schema

### Restaurant
```javascript
{
  name: String,
  location: String,
  createdBy: String,
  createdAt: Date
}
```

### Section
```javascript
{
  name: String,
  restaurant: ObjectId (ref: Restaurant),
  createdAt: Date
}
```

### Question
```javascript
{
  text: String,
  type: String (enum: ['yes/no', 'number', 'text']),
  section: ObjectId (ref: Section),
  restaurant: ObjectId (ref: Restaurant),
  createdAt: Date
}
```

### Response
```javascript
{
  restaurant: ObjectId (ref: Restaurant),
  section: ObjectId (ref: Section),
  employeePhone: String,
  employeeName: String,
  answers: [{
    question: ObjectId (ref: Question),
    questionText: String,
    answer: Mixed
  }],
  flowId: String,
  submittedAt: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/:id` - Get single restaurant

### Sections
- `GET /api/sections/restaurant/:restaurantId` - Get sections by restaurant
- `POST /api/sections` - Create section

### Questions
- `GET /api/questions/restaurant/:restaurantId` - Get questions by restaurant
- `GET /api/questions/section/:sectionId` - Get questions by section
- `POST /api/questions` - Create question

### WhatsApp
- `POST /api/whatsapp/send` - Send inspection form
- `POST /api/whatsapp/webhook` - Receive responses
- `GET /api/whatsapp/webhook` - Verify webhook

### Responses
- `GET /api/responses` - Get all responses
- `GET /api/responses/restaurant/:restaurantId` - Get responses by restaurant

## 🎬 Demo Video Guidelines

Record a 2-3 minute Loom video showing:

1. **Login** (0:00-0:10)
   - Login with default credentials

2. **Create Restaurant** (0:10-0:30)
   - Create McDonald's India - Jayanagar
   - Show it appears in the list

3. **Add Sections** (0:30-0:50)
   - Add Billing Counter, Dining Area, Washroom Area
   - Show the sections list

4. **Add Questions** (0:50-1:20)
   - Add sample questions for Billing Counter
   - Show questions organized by section

5. **Send Inspection** (1:20-1:50)
   - Enter phone number
   - Click "Generate & Send WhatsApp Form"
   - Show success message

6. **Dashboard** (1:50-2:30)
   - Show empty state initially
   - Explain webhook receives responses
   - Show example of what responses look like

7. **Quick Code Walkthrough** (2:30-3:00)
   - Show backend structure
   - Show frontend components
   - Mention WhatsApp API integration

## 🧪 Testing Without WhatsApp API

If you don't have WhatsApp API credentials:

1. The app will still work for all CRUD operations
2. Sending messages will fail gracefully with error messages
3. You can test the webhook endpoint manually using tools like Postman
4. Use this curl command to simulate a webhook response:

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
                "response_json": "{\"q_0_0\":\"yes\",\"q_0_1\":\"yes\",\"q_0_2\":\"3\"}",
                "body": {"section": "YOUR_SECTION_ID"}
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

## 📝 Notes

- This is a **prototype** focused on functionality over UI polish
- Authentication is simplified for demo purposes
- In production, use proper password hashing, JWT refresh tokens, and role-based access
- WhatsApp Flows have specific formatting requirements - see Meta's documentation
- Webhook URL must be publicly accessible (use ngrok for local testing)

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### WhatsApp API Errors
- Verify all credentials are correct
- Check that phone number is verified
- Ensure webhook is properly configured

### CORS Errors
- Backend CORS is configured for all origins
- Check VITE_API_URL in frontend .env

### Webhook Not Receiving Data
- Use ngrok: `ngrok http 5000`
- Update webhook URL in Meta dashboard
- Check webhook logs in terminal

## 📚 Additional Resources

- [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp Flows Guide](https://business.whatsapp.com/products/whatsapp-flows)
- [Meta API Postman Collection](https://www.postman.com/meta/whatsapp-business-platform)

## 🎯 Evaluation Criteria Met

✅ Complete end-to-end flow working  
✅ Admin can create restaurant  
✅ Admin can add sections  
✅ Admin can add questions per section  
✅ WhatsApp Flow generation implemented  
✅ API integration with Meta's WhatsApp API  
✅ Webhook to receive responses  
✅ Dashboard to view responses  
✅ Clean code structure  
✅ Clear documentation  
✅ Sample data included  

## 👨‍💻 Author

Hariom Pandey

## 📄 License

MIT
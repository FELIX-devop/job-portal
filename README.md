# Job Portal for Rural Workers

A full-stack web application to connect contractors with rural laborers (e.g., masons) in remote areas who often lack internet access and formal education.

## Features

- **User Registration/Login**: Separate flows for workers and contractors
- **Worker Dashboard**: Profile management, job offers, and inbox
- **Contractor Dashboard**: Worker search, job offer sending, and inbox
- **SMS Notifications**: Twilio integration for job alerts
- **Responsive Design**: Mobile-first design with dark theme
- **Real-time Communication**: Portal inbox for messaging

## Tech Stack

- **Frontend**: React JS with Tailwind CSS
- **Backend**: Spring Boot (Java 17) with Lombok
- **Database**: MongoDB (NoSQL)
- **Notifications**: Twilio API for SMS
- **Authentication**: JWT tokens

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MongoDB (local or cloud)
- Twilio account (for SMS functionality)

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Update application.properties**:
   - Set your MongoDB connection string
   - Configure Twilio credentials:
     ```properties
     twilio.account.sid=your-twilio-account-sid
     twilio.auth.token=your-twilio-auth-token
     twilio.phone.number=your-twilio-phone-number
     ```
   - Update JWT secret key

3. **Run the Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Workers
- `GET /api/workers` - Get all available workers
- `GET /api/workers/search` - Search workers by skills/location
- `GET /api/workers/{id}` - Get worker by ID
- `PUT /api/workers/{id}` - Update worker profile

### Job Offers
- `POST /api/job-offers/send` - Send job offer
- `GET /api/job-offers/worker/{workerId}` - Get worker's job offers
- `GET /api/job-offers/contractor/{contractorId}` - Get contractor's sent offers
- `PUT /api/job-offers/{offerId}/status` - Update job offer status

## Usage Flow

1. **Registration**: Users register as either workers or contractors
2. **Worker Profile**: Workers fill in skills, location, availability, and daily rate
3. **Contractor Search**: Contractors search for workers by skills and location
4. **Job Offers**: Contractors send job offers via portal or SMS
5. **Acceptance**: Workers can accept/decline job offers through the portal
6. **Communication**: Both parties can communicate through the inbox

## Features for Rural Workers

- **SMS Notifications**: Workers without internet can receive job alerts via SMS
- **Simple Interface**: Easy-to-use design for users with limited digital literacy
- **Mobile Responsive**: Works well on basic smartphones
- **Offline Capability**: Basic functionality works without constant internet

## Environment Variables

### Backend (.env or application.properties)
```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/rural_job_portal

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Twilio
twilio.account.sid=your-account-sid
twilio.auth.token=your-auth-token
twilio.phone.number=your-twilio-number
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@ruraljobportal.com or create an issue in the repository. 
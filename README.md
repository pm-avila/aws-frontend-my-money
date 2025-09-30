# aws-frontend-my-money
A personal financial control system built for AWS deployment, providing comprehensive personal finance management with a modern and intuitive interface.

## ⚡ Quick Start

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd aws-frontend-my-money
   npm install
   ```

2. **Configure API URL**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed (defaults to localhost:3000/api)
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

### Environment Configuration

The application supports different API endpoints for development and production:

| Environment | File | API URL | Purpose |
|-------------|------|---------|---------|
| Development | `.env.local` | `http://localhost:3000/api` | Local backend |
| Production | Environment Variable | `https://your-api.com/api` | AWS Deployment |

#### 🔧 Setting up API URL for Production

For AWS deployments, set the environment variable `REACT_APP_API_BASE_URL`:

**AWS ECS (Task Definition):**
```json
{
  "environment": [
    {
      "name": "REACT_APP_API_BASE_URL",
      "value": "https://your-elb.amazonaws.com/api"
    }
  ]
}
```

**AWS Amplify:**
- Go to Amplify Console → App settings → Environment variables
- Add: `REACT_APP_API_BASE_URL=https://api.yourdomain.com/api`

**AWS CloudFront + S3:**
- Set in build process or Lambda@Edge

#### 🔐 Backend Production Configuration

The backend uses AWS RDS Secrets Manager for database credentials:

**RDS Secret (auto-generated):**
```json
{
  "host": "my-money-db.cluster-xyz.us-east-1.rds.amazonaws.com",
  "username": "admin_generated",
  "password": "auto-generated-password",
  "port": "5432",
  "database": "myapp_production"
}
```

**Environment Variables:**
```bash
JWT_SECRET=your-static-jwt-secret
PORT=8080
SECRET_NAME=my-money-backend-secrets
```

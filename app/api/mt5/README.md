# MT5 API Integration

This directory contains API endpoints for integrating MetaTrader 5 (MT5) with the CRM system.

## API Endpoints

### 1. Connect to MT5
**POST** `/api/mt5/connect`

Establishes a connection to the MetaTrader 5 server.

**Request Body:**
```json
{
  "apiId": "your-api-id",
  "appSecret": "your-app-secret",
  "accountDetails": {
    "login": 123456,
    "password": "your-password"
  },
  "serverAddress": "demo-server.mt5.com:443"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to MetaTrader 5",
  "connectionId": "mt5_1234567890",
  "serverInfo": {
    "serverName": "demo-server.mt5.com:443",
    "connectedAt": "2024-10-23T12:00:00.000Z",
    "apiVersion": "5.0",
    "build": "build_12345"
  }
}
```

### 2. Get MT5 Accounts
**GET** `/api/mt5/accounts?connectionId=mt5_123`

Retrieves all accounts from the connected MT5 server.

**Response:**
```json
{
  "accounts": [
    {
      "id": "1",
      "login": 123456,
      "name": "Demo Account 1",
      "balance": 10000.50,
      "equity": 10250.75,
      "margin": 2450.00,
      "marginFree": 7800.75,
      "marginLevel": 418.23,
      "profit": 250.25,
      "currency": "USD",
      "leverage": 1,
      "server": "Demo-Server",
      "status": "ACTIVE"
    }
  ],
  "total": 2
}
```

**POST** `/api/mt5/accounts` - Create a new MT5 account

**Request Body:**
```json
{
  "connectionId": "mt5_123",
  "accountDetails": {
    "name": "New Account",
    "leverage": 100,
    "currency": "USD",
    "server": "Demo-Server"
  }
}
```

### 3. Get Trading History
**GET** `/api/mt5/history?connectionId=mt5_123&login=123456&startDate=2024-10-01&endDate=2024-10-31`

Retrieves trading history for a specific account.

**Query Parameters:**
- `connectionId` (required) - The MT5 connection ID
- `login` (required) - The account login number
- `startDate` (optional) - Start date for filtering
- `endDate` (optional) - End date for filtering

**Response:**
```json
{
  "history": [
    {
      "id": "1",
      "login": 123456,
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.10,
      "priceOpen": 1.08500,
      "priceCurrent": 1.08750,
      "profit": 25.00,
      "swap": -1.20,
      "commission": 0.70,
      "timeOpen": "2024-10-22T12:00:00.000Z",
      "timeClose": "2024-10-22T16:00:00.000Z",
      "status": "CLOSED"
    }
  ],
  "summary": {
    "total": 4,
    "open": 2,
    "closed": 2,
    "totalProfit": 92.50,
    "openPositions": 2
  }
}
```

### 4. Get Real-time Positions
**GET** `/api/mt5/positions?connectionId=mt5_123&login=123456`

Retrieves current open positions.

**Response:**
```json
{
  "positions": [
    {
      "ticket": 12345678,
      "login": 123456,
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.10,
      "priceOpen": 1.08500,
      "priceCurrent": 1.08750,
      "profit": 25.00,
      "swap": -1.20,
      "commission": 0.70,
      "timeOpen": "2024-10-23T11:00:00.000Z",
      "comment": "Manual trade"
    }
  ],
  "summary": {
    "total": 3,
    "buyPositions": 2,
    "sellPositions": 1,
    "totalProfit": 85.00,
    "totalSwap": -5.40,
    "totalCommission": 3.15,
    "netProfit": 76.45
  }
}
```

### 5. Test Connection
**POST** `/api/mt5/test`

Tests the MT5 connection with various test types.

**Request Body:**
```json
{
  "connectionId": "mt5_123",
  "testType": "connection"
}
```

**Test Types:**
- `connection` - Test basic connection
- `data_sync` - Test data synchronization
- `trading` - Test trading functionality
- `all` or no type - Run all tests

**Response:**
```json
{
  "success": true,
  "testType": "connection",
  "results": {
    "success": true,
    "latency": 45,
    "apiVersion": "5.0",
    "serverStatus": "ONLINE",
    "permissions": {
      "trade": true,
      "read": true,
      "accountManagement": true
    }
  },
  "timestamp": "2024-10-23T12:00:00.000Z"
}
```

### 6. Get/Update Configuration
**GET** `/api/mt5/config?connectionId=mt5_123`

Retrieves the current integration configuration.

**PUT** `/api/mt5/config`

Updates the integration configuration.

**Request Body:**
```json
{
  "connectionId": "mt5_123",
  "config": {
    "serverAddress": "demo-server.mt5.com:443",
    "autoSync": true,
    "syncInterval": 300,
    "enabledActions": {
      "createAccounts": true,
      "updateBalances": true,
      "retrieveHistory": true,
      "monitorPositions": true
    },
    "notificationSettings": {
      "newAccounts": true,
      "balanceChanges": true,
      "positionOpened": true,
      "positionClosed": true
    }
  }
}
```

## Integration Workflow

1. **Connect to MT5**: Use `/api/mt5/connect` to establish connection
2. **Save Connection ID**: Store the returned connection ID for subsequent API calls
3. **Configure Integration**: Use `/api/mt5/config` to set up automation settings
4. **Test Connection**: Use `/api/mt5/test` to verify the integration
5. **Retrieve Data**: Use accounts, history, and positions endpoints to sync data
6. **Monitor**: Set up notifications for real-time updates

## Authentication

All endpoints require authentication. Include the connection ID in requests after establishing a connection.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (missing or invalid parameters)
- `500` - Server error

Error response format:
```json
{
  "error": "Error message describing what went wrong"
}
```

## Production Implementation

For production use, replace the mock data with actual MT5 API calls:

1. Use MT5 Manager API for account management
2. Use MT5 Gateway API for trade execution
3. Implement WebSocket connections for real-time updates
4. Add proper error handling and retry logic
5. Implement rate limiting
6. Add connection pooling for better performance

## Security Considerations

- Store API credentials securely (environment variables, encrypted)
- Use HTTPS for all API calls
- Implement request rate limiting
- Validate all input parameters
- Log all API access for audit trails
- Implement proper timeout handling


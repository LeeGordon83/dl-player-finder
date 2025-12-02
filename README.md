# DL Player Finder App

## Description

DL Player Finder helps users research and analyse players for Dream League Fantasy Football.

## Prerequisites

-   Docker and Docker Compose
    
-   Node.js 18 (if running locally)
    

## Docker Setup

### Quick Start

```bash
# Build and start all services
docker-compose up --build

# To run in detached mode (background)
docker-compose up -d --build

# To stop all services
docker-compose down

```

The docker-compose setup includes:

-   Node.js application service
    
-   MongoDB database
    
-   Automatic network configuration
    
-   Volume mounting for MongoDB persistence
    
-   Hot-reload for development
    

## Environment Variables

Create a .env file in the project root with these variables:

| Variable            | Description                         | Default                                                 |
|---------------------|-------------------------------------|---------------------------------------------------------|
| `PORT`              | Application port                    | `3000`                                                  |
| `MONGO_URL`         | MongoDB connection string           | `mongodb://mongo:27017/dream-league`                   |
| `NODE_ENV`          | Environment setting                 | `development`                                           |
| `DREAM_LEAGUE_URL`  | Dream League API URL                | `https://dreamleaguefantasyfootball.co.uk/api/v1/manager/teams` |
| `FB_CHAMPIONSHIP`   | FBRef Championship Stats URL        | FBRef Championship statistics page                      |
| `FB_LEAGUE_ONE`     | FBRef League One Stats URL          | FBRef League One statistics page                        |
| `FB_LEAGUE_TWO`     | FBRef League Two Stats URL          | FBRef League Two statistics page                        |


## Development

The application is configured with hot-reload in development mode. Code changes will automatically trigger rebuilds.

### Features

-   Node.js 18 Alpine-based image for minimal size
    
-   Development and Production multi-stage builds
    
-   Built-in Git support for version control
    
-   Non-root user (node) for better security
    
-   NPM dependency caching for faster builds
    
-   Hot-reload support in development
    
-   Persistent MongoDB storage
    
-   Containerized development environment
    
-   Web scraping for real-time player statistics from FBRef
    

## Scripts

```bash
# Start all services with logs
docker-compose up

# Rebuild and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Access MongoDB shell
docker-compose exec mongo mongosh

```


## Debugging

The application exposes port 9229 for Node.js debugging capabilities. To attach a debugger:

1.  Start the containers with docker-compose up
    
2.  Connect your IDE's debugger to localhost:9229
    
3.  Add breakpoints as needed
    

## Database

MongoDB data is persisted in the ./data directory. To reset the database:

```bash
# Stop all services
docker-compose down

# Remove the data directory
rm -rf ./data

# Restart services
docker-compose up

```
    

## Troubleshooting

-   If the application fails to start, ensure all required environment variables are set in your .env file
    
-   If MongoDB fails to start, check if port 27017 is already in use
    
-   For permission issues with the MongoDB volume, ensure the ./data directory has appropriate permissions
    

## License

MIT License

Copyright (c) 2025 Lee Gordon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

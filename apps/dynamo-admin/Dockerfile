FROM node:18-alpine

WORKDIR /app

# Install dynamodb-admin globally
RUN npm install -g dynamodb-admin

# Expose port
EXPOSE 8001

# Start dynamodb-admin
CMD ["dynamodb-admin", "--port", "8001", "--host", "0.0.0.0"]

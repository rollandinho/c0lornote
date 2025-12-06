#!/bin/bash

# c0lornote Database Backup Script
# Usage: ./backup-db.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="c0lornote_backup_${TIMESTAMP}"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🗄️  c0lornote Database Backup"
echo "================================"
echo "Timestamp: $TIMESTAMP"
echo "Backup location: $BACKUP_DIR/$BACKUP_FILE"
echo ""

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    echo "❌ mongodump is not installed."
    echo "Please install MongoDB Database Tools:"
    echo "https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Extract database name from MONGODB_URI
DB_NAME="c0lornote"

# Perform backup
echo "📦 Creating backup..."
mongodump --uri="${MONGODB_URI}" --out="${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backup completed successfully!"
    echo "Backup saved to: ${BACKUP_DIR}/${BACKUP_FILE}"
    echo ""
    echo "To restore this backup, run:"
    echo "mongorestore --uri=\"${MONGODB_URI}\" ${BACKUP_DIR}/${BACKUP_FILE}"
else
    echo ""
    echo "❌ Backup failed!"
    exit 1
fi

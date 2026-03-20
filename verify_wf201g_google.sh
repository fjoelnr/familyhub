#!/bin/bash
# Reference Verification Script for WF-201G (Google Calendar Read)

TARGET_URL="http://192.168.178.20:5678/webhook/familyhub/calendar-read-google"

echo "Calling WF-201G at: $TARGET_URL"

# Capturing full output including headers (-i) to a file for review
curl -i -X POST "$TARGET_URL" \
  -H "Content-Type: application/json" \
  -d '{"range":"today"}' > response_ref.txt 2>&1

echo "Response received:"
head -n 20 response_ref.txt
echo "..."

echo ""
echo "---------------------------------------------------"
echo "Check response_ref.txt for full JSON"

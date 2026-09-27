#!/usr/bin/env bash

echo "========================================================"
echo "    Starting CampusConnect Platform (Linux/macOS/Bash)  "
echo "========================================================"

# Trap SIGINT to kill background jobs cleanly on exit
trap 'kill $(jobs -p) 2>/dev/null' EXIT

echo "Starting Backend API on port 5000..."
cd backend && npm start &
BACKEND_PID=$!
cd ..

sleep 2

echo "Starting Frontend on port 3000..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo "CampusConnect is running!"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo "Press Ctrl+C to stop both servers."

wait

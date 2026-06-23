echo "Starting QHSSE Platform..."
cd /home/topiksarip/Downloads/QHSSE/qhsse-platform

API_PORT=29567
WEB_PORT=44807

echo "PORT=$API_PORT" > .env
echo "NEXT_PUBLIC_API_URL=http://localhost:$API_PORT/api/v1" > apps/web/.env.local

echo "Starting API on port $API_PORT..."
cd apps/api && npx ts-node --transpile-only src/main.ts &
API_PID=$!

echo "Starting Web on port $WEB_PORT..."
cd /home/topiksarip/Downloads/QHSSE/qhsse-platform/apps/web && npx next dev --port $WEB_PORT &
WEB_PID=$!

sleep 25
echo ""
echo "=== ACCESS URLS ==="
echo "Web:  http://localhost:$WEB_PORT"
echo "API:  http://localhost:$API_PORT/api/v1/health"
echo "Swagger: http://localhost:$API_PORT/api/docs"
echo ""
echo "=== CREDENTIALS ==="
echo "Admin:  admin@qhsse.com / Admin123!"
echo "Manager: manager@qhsse.com / Manager123!"
echo ""
echo "PIDs: API=$API_PID, Web=$WEB_PID"
echo "To stop: kill $API_PID $WEB_PID"

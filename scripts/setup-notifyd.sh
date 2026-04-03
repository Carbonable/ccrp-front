#!/bin/bash
# Setup CCRP project on notifyd
# Run once after notifyd is accessible

NOTIFYD_URL="${NOTIFYD_URL:-https://notifyd.ctrlnz.com}"
ADMIN_KEY="41764c6234f6995a747ed56d2b8230df616055724259a8a0865757bc657dfd07"

echo "=== Creating CCRP project ==="
RESULT=$(curl -s -X POST "$NOTIFYD_URL/v1/admin/projects" \
  -H "X-Api-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ccrp",
    "name": "Carbonable CCRP",
    "channels": ["in_app"],
    "rate_limit_per_min": 300
  }')

echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"

# Extract API key
API_KEY=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['project']['api_key'])" 2>/dev/null)

if [ -z "$API_KEY" ]; then
  echo "ERROR: Could not extract API key"
  exit 1
fi

echo ""
echo "=== CCRP API Key ==="
echo "$API_KEY"
echo ""
echo "Add to CCRP Dokploy env:"
echo "  NOTIFYD_URL=$NOTIFYD_URL"
echo "  NOTIFYD_API_KEY=$API_KEY"
echo ""
echo "Add to notifyd Dokploy CORS_ORIGINS:"
echo "  https://ccrp.carbonable.io,https://demo.ccpm.carbonable.io"
echo ""

echo "=== Seeding onboarding notifications ==="
# These seed notifications will be visible to ALL users (using a special "system" subscriber)
# Real notifications will be sent per-user when they perform actions.
# We'll create them for a demo user.
echo "Seed notifications should be sent per-user via the CCRP backend when users are provisioned."
echo ""
echo "Done! CCRP project created on notifyd."

#!/bin/bash
# ONES Marketplace API Automation Test Script

# Remove set -e to allow script to continue on failures
# set -e

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3001/api}"
AUTH_TOKEN="mock-token-12345"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Helper functions
log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

log_section() {
    echo ""
    echo "========================================"
    echo "$1"
    echo "========================================"
}

# Make request and check status
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    ((TOTAL++))
    
    local url="${BASE_URL}${endpoint}"
    local response
    local status
    
    if [ "$method" = "GET" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X GET "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $AUTH_TOKEN" 2>&1) || true
    elif [ "$method" = "POST" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X POST "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $AUTH_TOKEN" -d "$data" 2>&1) || true
    elif [ "$method" = "PUT" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X PUT "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $AUTH_TOKEN" -d "$data" 2>&1) || true
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X DELETE "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $AUTH_TOKEN" 2>&1) || true
    fi
    
    status=$(echo "$response" | tail -n1)
    
    if [ "$status" = "$expected_status" ]; then
        log_pass "$description"
    else
        log_fail "$description (expected: $expected_status, got: $status)"
    fi
}

# Test without auth
test_endpoint_no_auth() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    ((TOTAL++))
    
    local url="${BASE_URL}${endpoint}"
    local response
    local status
    
    if [ "$method" = "GET" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X GET "$url" 2>&1) || true
    elif [ "$method" = "POST" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X POST "$url" -H "Content-Type: application/json" -d "$data" 2>&1) || true
    elif [ "$method" = "PUT" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X PUT "$url" -H "Content-Type: application/json" -d "$data" 2>&1) || true
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X DELETE "$url" 2>&1) || true
    fi
    
    status=$(echo "$response" | tail -n1)
    
    if [ "$status" = "$expected_status" ]; then
        log_pass "$description"
    else
        log_fail "$description (expected: $expected_status, got: $status)"
    fi
}

# Run tests
echo "Starting ONES Marketplace API Tests"
echo "Base URL: $BASE_URL"
echo ""

# Check if server is running
log_info "Checking if server is running..."
if ! curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/categories" | grep -q "200"; then
    log_fail "Server not running at $BASE_URL"
    log_info "Please start the server with: cd apps/backend && npm run dev"
    exit 1
fi
log_pass "Server is running"

# 1. Authentication Tests
log_section "1. Authentication API Tests"

# 1.1 Register Tests
log_section "1.1 Register Tests"

test_endpoint_no_auth POST "/auth/register" '{"email":"test@example.com","password":"pass123"}' "201" "TC-AUTH-REG-001: Register with valid credentials"
test_endpoint_no_auth POST "/auth/register" '{"email":"test@example.com","password":"pass123"}' "400" "TC-AUTH-REG-002: Register with duplicate email"
test_endpoint_no_auth POST "/auth/register" '{"email":"invalid-email","password":"pass123"}' "400" "TC-AUTH-REG-003: Register with invalid email"
test_endpoint_no_auth POST "/auth/register" '{"email":"test2@example.com","password":"123"}' "400" "TC-AUTH-REG-004: Register with short password"
test_endpoint_no_auth POST "/auth/register" '{"email":"test3@example.com","password":"password"}' "400" "TC-AUTH-REG-005: Register with password without number"
test_endpoint_no_auth POST "/auth/register" '{"password":"pass123"}' "400" "TC-AUTH-REG-006: Register with missing email"
test_endpoint_no_auth POST "/auth/register" '{"email":"test4@example.com"}' "400" "TC-AUTH-REG-007: Register with missing password"

# 1.2 Login Tests
log_section "1.2 Login Tests"

# First register a user to test login
test_endpoint_no_auth POST "/auth/register" '{"email":"logintest@example.com","password":"pass123"}' "201" "Register for login test"
test_endpoint_no_auth POST "/auth/login" '{"email":"logintest@example.com","password":"pass123"}' "200" "TC-AUTH-LOGIN-001: Login with valid credentials"
test_endpoint_no_auth POST "/auth/login" '{"email":"logintest@example.com","password":"wrongpass"}' "401" "TC-AUTH-LOGIN-002: Login with invalid password"
test_endpoint_no_auth POST "/auth/login" '{"email":"nonexistent@example.com","password":"pass123"}' "401" "TC-AUTH-LOGIN-003: Login with non-existent email"
test_endpoint_no_auth POST "/auth/login" '{"email":"invalid-email","password":"pass123"}' "400" "TC-AUTH-LOGIN-004: Login with invalid email"
test_endpoint_no_auth POST "/auth/login" '{"password":"pass123"}' "400" "TC-AUTH-LOGIN-005: Login with missing email"
test_endpoint_no_auth POST "/auth/login" '{"email":"test@example.com"}' "400" "TC-AUTH-LOGIN-006: Login with missing password"

# 2. Apps API Tests
log_section "2. Apps API Tests"

# 2.1 List Apps
log_section "2.1 List Apps"

test_endpoint GET "/apps" "" "200" "TC-APPS-LIST-001: List all apps"
test_endpoint GET "/apps?q=Slack" "" "200" "TC-APPS-LIST-002: Search apps by name"
test_endpoint GET "/apps?q=project" "" "200" "TC-APPS-LIST-003: Search apps by description"
test_endpoint GET "/apps?q=slack" "" "200" "TC-APPS-LIST-004: Search with case insensitive"
test_endpoint GET "/apps?category=Development" "" "200" "TC-APPS-LIST-005: Filter by category"
test_endpoint GET "/apps?sort=installs" "" "200" "TC-APPS-LIST-006: Sort by installs"
test_endpoint GET "/apps?sort=rating" "" "200" "TC-APPS-LIST-007: Sort by rating"
test_endpoint GET "/apps?sort=name" "" "200" "TC-APPS-LIST-008: Sort by name"
test_endpoint GET "/apps?q=team&category=Collaboration" "" "200" "TC-APPS-LIST-009: Combined search and filter"
test_endpoint GET "/apps?q=nonexistent" "" "200" "TC-APPS-LIST-010: Search with no results"

# 2.2 Get App by ID
log_section "2.2 Get App by ID"

test_endpoint GET "/apps/1" "" "200" "TC-APPS-GET-001: Get existing app"
test_endpoint GET "/apps/999" "" "404" "TC-APPS-GET-002: Get non-existent app"
test_endpoint GET "/apps/invalid-id" "" "400" "TC-APPS-GET-003: Get app with invalid UUID"

# 3. Categories API Tests
log_section "3. Categories API Tests"

test_endpoint GET "/categories" "" "200" "TC-CAT-001: Get all categories"

# 4. User API Tests (Protected)
log_section "4. User API Tests"

# 4.1 Installations
log_section "4.1 Installations"

test_endpoint_no_auth GET "/user/installations" "" "401" "TC-USER-INST-001: Get installations without auth"
test_endpoint GET "/user/installations" "" "200" "TC-USER-INST-002: Get installations with auth"
test_endpoint_no_auth POST "/user/installations" '{"appId":"1"}' "401" "TC-USER-INST-003: Install app without auth"
test_endpoint POST "/user/installations" '{"appId":"2"}' "201" "TC-USER-INST-004: Install app with auth"
test_endpoint POST "/user/installations" '{"appId":"999"}' "404" "TC-USER-INST-005: Install non-existent app"
test_endpoint_no_auth DELETE "/user/installations/1" "" "401" "TC-USER-INST-007: Uninstall app without auth"
test_endpoint DELETE "/user/installations/1" "" "200" "TC-USER-INST-008: Uninstall app with auth"

# 4.2 Profile
log_section "4.2 Profile"

test_endpoint_no_auth GET "/user/profile" "" "401" "TC-USER-PROF-001: Get profile without auth"
test_endpoint GET "/user/profile" "" "200" "TC-USER-PROF-002: Get profile with auth"
test_endpoint_no_auth PUT "/user/profile" '{"name":"Test User"}' "401" "TC-USER-PROF-003: Update profile without auth"
test_endpoint PUT "/user/profile" '{"name":"Test User"}' "200" "TC-USER-PROF-004: Update profile with auth"
test_endpoint PUT "/user/profile" '{"bio":"Hello world"}' "200" "TC-USER-PROF-006: Update profile with bio"
test_endpoint PUT "/user/profile" '{"notifications":false}' "200" "TC-USER-PROF-007: Update profile with notifications"

# 5. Error Handling Tests
log_section "5. Error Handling Tests"

test_endpoint GET "/unknown" "" "404" "TC-ERR-001: 404 for unknown route"

# Summary
log_section "Test Summary"
echo "Total: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi

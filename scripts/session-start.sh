#!/bin/bash
# ============================================================
# ATHLYNX — SESSION START SCRIPT
# Run this at the beginning of EVERY session before any work.
# ============================================================
# Usage: bash scripts/session-start.sh
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║         ATHLYNX SESSION START — HARDENING            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# 1. Pull latest from GitHub
echo "📥 Pulling latest from GitHub..."
git pull origin main --quiet
echo "   ✅ Up to date"

# 2. Harden all server routers
echo ""
echo "🔒 Hardening server routers..."
python3 scripts/harden-routers.py

# 3. Verify no build errors (TypeScript check)
echo ""
echo "🔍 Checking for TypeScript errors..."
npx tsc --noEmit --project tsconfig.json 2>/dev/null && echo "   ✅ No TypeScript errors" || echo "   ⚠️  TypeScript warnings (check before pushing)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║              SESSION READY — BUILD SOMETHING         ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Platform: https://athlynx.ai"
echo "GitHub:   AthlyXAI/Athlynx-V2-Official (main)"
echo "Deploy:   git push origin main → Vercel auto-deploys"
echo ""
echo "RULES:"
echo "  - NEVER run manus-config save-config"
echo "  - NEVER push untested code"
echo "  - ALWAYS push ALL code before ending session"
echo "  - Home page is LOCKED — do not modify"
echo "  - NO yellow on any branded materials"
echo ""

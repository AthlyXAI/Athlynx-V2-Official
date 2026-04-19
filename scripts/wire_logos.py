#!/usr/bin/env python3
"""
Wire all 7 brand logos into the correct components in chaddozier-bot/athlynx.ai
Per MANUS DIRECTIVE April 18, 2026
"""
import os
import re

BASE = "/home/ubuntu/athlynx-main"

# Logo mapping: old references → new /public/images/logos/ paths
LOGO_MAP = {
    # Athlynx main logo (blue crystal mountain)
    "/crab-logo-official.png": "/images/logos/athlynx-main-logo.png",
    "/athlynx-logo-icon.png": "/images/logos/athlynx-main-logo.png",
    "/athlynx-playbook-logo.png": "/images/logos/athlynx-main-logo.png",
    "/nil-portal-app-logo.jpeg": "/images/logos/nil-portal-logo.png",
    "/nil-portal-app-logo.png": "/images/logos/nil-portal-logo.png",
}

# Component-specific overrides based on context
COMPONENT_OVERRIDES = {
    # DHGHome.tsx → use DHG crab logo
    "DHGHome.tsx": {
        "/images/logos/athlynx-main-logo.png": "/images/logos/dhg-logo.png",
    },
    # Portal.tsx → NIL Portal logo for the portal page
    "Portal.tsx": {
        "/images/logos/athlynx-main-logo.png": "/images/logos/nil-portal-logo.png",
    },
}

updated = []

for root, dirs, files in os.walk(os.path.join(BASE, "client/src")):
    # Skip node_modules
    dirs[:] = [d for d in dirs if d != "node_modules"]
    for fname in files:
        if not fname.endswith((".tsx", ".ts", ".jsx", ".js")):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        original = content
        
        # Apply global logo map
        for old, new in LOGO_MAP.items():
            content = content.replace(old, new)
        
        # Apply component-specific overrides
        if fname in COMPONENT_OVERRIDES:
            for old, new in COMPONENT_OVERRIDES[fname].items():
                content = content.replace(old, new)
        
        if content != original:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)
            updated.append(fpath.replace(BASE + "/", ""))
            print(f"Updated: {fpath.replace(BASE + '/', '')}")

# Also update LandingPage app icons to use correct logos
landing_path = os.path.join(BASE, "client/src/pages/LandingPage.tsx")
if os.path.exists(landing_path):
    with open(landing_path, "r") as f:
        content = f.read()
    original = content
    # Update specific app icons in the apps array
    content = re.sub(
        r'(\{ name: "NIL Portal"[^}]*icon: ")[^"]*(")',
        r'\1/images/logos/nil-portal-logo.png\2',
        content
    )
    content = re.sub(
        r'(\{ name: "NIL Messenger"[^}]*icon: ")[^"]*(")',
        r'\1/images/logos/nil-messenger-logo.png\2',
        content
    )
    content = re.sub(
        r'(\{ name: "Diamond Grind"[^}]*icon: ")[^"]*(")',
        r'\1/images/logos/mobile-app-icon.png\2',
        content
    )
    if content != original:
        with open(landing_path, "w") as f:
            f.write(content)
        if landing_path not in updated:
            updated.append("client/src/pages/LandingPage.tsx")
            print("Updated: client/src/pages/LandingPage.tsx (app icons)")

print(f"\nTotal files updated: {len(updated)}")
print("All logos wired in.")

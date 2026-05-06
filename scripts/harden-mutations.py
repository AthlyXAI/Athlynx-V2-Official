#!/usr/bin/env python3
"""
ATHLYNX — CLIENT MUTATION HARDENING SCRIPT
===========================================
Adds onError toast handlers to every useMutation that is missing one.
Run this at the start of EVERY session.

Usage:
    python3 scripts/harden-mutations.py

What it fixes:
- Every useMutation({ onSuccess: ... }) without onError gets one added
- Uses sonner toast.error() — already imported in most files
- Ensures users always see feedback when something fails
"""
import os
import re

CLIENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'client', 'src')

TOAST_IMPORT = 'import { toast } from "sonner";'

def harden_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        original = f.read()

    content = original

    # Find useMutation blocks without onError and add it
    # Pattern: useMutation({ ... onSuccess: ... }) with no onError
    def add_on_error(match):
        block = match.group(0)
        if 'onError' in block:
            return block  # already has it
        # Add onError before the closing })
        # Find the last }) that closes the useMutation config object
        insert = ',\n    onError: (err: any) => { toast.error(err?.message || "Something went wrong. Please try again."); }'
        # Insert before the closing }); of the mutation config
        block = re.sub(r'(\s*}\s*\)\s*;?\s*)$', insert + r'\1', block, count=1)
        return block

    # Match useMutation({ ... }) blocks (simplified — catches most cases)
    # Look for .useMutation({ followed by content and closing })
    new_content = re.sub(
        r'\.useMutation\(\{[^}]*(?:\{[^}]*\}[^}]*)?\}\)',
        add_on_error,
        content,
        flags=re.DOTALL
    )

    # Ensure toast is imported if we added onError handlers
    if new_content != content:
        if 'toast' not in new_content:
            # Add toast import
            new_content = re.sub(
                r'^(import .+from .+;\n)',
                r'\1' + TOAST_IMPORT + '\n',
                new_content,
                count=1,
                flags=re.MULTILINE
            )
        elif TOAST_IMPORT not in new_content and 'from "sonner"' not in new_content:
            new_content = re.sub(
                r'^(import .+from .+;\n)',
                r'\1' + TOAST_IMPORT + '\n',
                new_content,
                count=1,
                flags=re.MULTILINE
            )

    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False


def main():
    fixed_files = []

    for root, dirs, files in os.walk(CLIENT_DIR):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git']]
        for filename in files:
            if not filename.endswith('.tsx'):
                continue
            filepath = os.path.join(root, filename)
            if harden_file(filepath):
                fixed_files.append(filepath.replace(CLIENT_DIR + '/', ''))

    if fixed_files:
        print(f"✅ Added onError handlers to {len(fixed_files)} files:")
        for f in fixed_files[:20]:
            print(f"   {f}")
        if len(fixed_files) > 20:
            print(f"   ... and {len(fixed_files) - 20} more")
    else:
        print("✅ All mutations already have error handlers.")

    print("\n🔒 Client mutation hardening complete.")


if __name__ == '__main__':
    main()

#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

: "${ANSIBLE_INVENTORY:=../inventory/lab/hosts.yml}"
ansible-playbook -i "$ANSIBLE_INVENTORY" playbooks/04-verify.yml

echo "Verification completed successfully."

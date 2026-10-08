#!/usr/bin/env bash
set -euo pipefail

KUBECTL_BIN="${KUBECTL_BIN:-kubectl}"

for ns in staging prod; do
  if [[ "$ns" == "staging" ]]; then
    host="staging.tahiry-cloud.com"
  else
    host="tahiry-cloud.com"
  fi

  echo "== namespace: $ns =="
  "$KUBECTL_BIN" get pods -n "$ns"
  status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --max-time 10 -H "Host: $host" http://127.0.0.1/)"
  printf 'HTTP /: %s\n' "$status"
  [[ "$status" == "200" ]] || {
    echo "ERROR: $host returned HTTP $status (expected 200)." >&2
    exit 1
  }

  status_api="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --max-time 10 -H "Host: $host" http://127.0.0.1/api/version)"
  printf 'HTTP /api/version: %s\n' "$status_api"
  [[ "$status_api" == "200" ]] || {
    echo "ERROR: $host /api/version returned HTTP $status_api." >&2
    exit 1
  }
done

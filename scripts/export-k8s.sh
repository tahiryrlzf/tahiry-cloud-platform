#!/usr/bin/env bash
# Exporte les ressources du cluster, SANS les Secrets.
set -euo pipefail
umask 077

OUT="${1:-k8s-export}"
mkdir -p "$OUT"

echo "▶ Export vers $OUT/ (secrets exclus)"

kubectl get all,ingress,cm,statefulset,pvc -A -o yaml > "$OUT/all.yaml"
kubectl get ns prod staging -o yaml > "$OUT/namespaces.yaml"
kubectl get ingress -A -o yaml > "$OUT/ingress.yaml"

kubectl get pods -A -o jsonpath='{range .items[*]}{.spec.containers[*].image}{"\n"}{end}' \
  | sort -u > "$OUT/images.txt"

echo "✅ Fait"
ls -la "$OUT/"

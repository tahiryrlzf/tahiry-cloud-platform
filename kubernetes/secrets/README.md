# Secrets chiffrés (Sealed Secrets)

Un SealedSecret est **lié à un namespace**. Il faut un fichier par namespace.

## Chiffrer ghcr-pull

```bash
kubectl create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=tahiryrlzf \
  --docker-password="<TOKEN>" \
  --dry-run=client -o yaml \
  | kubeseal --format yaml --cert pub-sealed-secrets.pem -n prod \
  > kubernetes/secrets/prod/ghcr-pull.sealed.yaml

kubectl create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=tahiryrlzf \
  --docker-password="<TOKEN>" \
  --dry-run=client -o yaml \
  | kubeseal --format yaml --cert pub-sealed-secrets.pem -n staging \
  > kubernetes/secrets/staging/ghcr-pull.sealed.yaml
```

## Chiffrer postgres-credentials

```bash
PG_PASSWORD=$(openssl rand -base64 24)
DATABASE_URL="postgres://portfolio:${PG_PASSWORD}@portfolio-postgres:5432/portfolio?sslmode=disable"

kubectl create secret generic postgres-credentials \
  --from-literal=username=portfolio \
  --from-literal=password="${PG_PASSWORD}" \
  --from-literal=url="${DATABASE_URL}" \
  --dry-run=client -o yaml \
  | kubeseal --format yaml --cert pub-sealed-secrets.pem -n prod \
  > kubernetes/secrets/prod/postgres-credentials.sealed.yaml

# Idem staging avec -n staging et un mot de passe différent
```

## Après génération

1. Retirer `.example` des fichiers générés.
2. Décommenter les références dans les overlays.
3. Supprimer les secrets créés par Ansible :
   ```bash
   kubectl delete secret ghcr-pull -n prod staging
   kubectl delete secret postgres-credentials -n prod staging

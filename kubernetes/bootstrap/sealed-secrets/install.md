# Installation Sealed Secrets

## Vérifier la dernière version

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo update
helm search repo sealed-secrets/sealed-secrets --versions | head
```

## Installation

```bash
helm install sealed-secrets sealed-secrets/sealed-secrets \
  --namespace kube-system \
  --version <VERSION_AFFICHEE> \
  --values kubernetes/bootstrap/sealed-secrets/values.yaml
```

## Clé publique

```bash
kubeseal --fetch-cert \
  --controller-name=sealed-secrets-controller \
  --controller-namespace=kube-system \
  > pub-sealed-secrets.pem
```

`pub-sealed-secrets.pem` est public, versionnable.

## Clé privée (OBLIGATOIRE)

```bash
kubectl get secret -n kube-system \
  -l sealedsecrets.bitnami.com/sealed-secrets-key \
  -o yaml > sealed-secrets-master.key.yaml

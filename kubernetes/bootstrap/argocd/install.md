# Installation ArgoCD

## Namespace

```bash
kubectl create namespace argocd
kubectl label namespace argocd \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/warn=restricted
```

Si rejet PSA, passer en `baseline` et documenter dans un ADR.

## Helm

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm search repo argo/argo-cd --versions | head

helm install argocd argo/argo-cd -n argocd \
  --version <VERSION_AFFICHEE> \
  --values kubernetes/bootstrap/argocd/values.yaml
```

## Deploy key (lecture seule)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/argocd_deploy_key -C "argocd" -N ""
cat ~/.ssh/argocd_deploy_key.pub
```

Ajouter dans GitHub → Settings → Deploy keys → **ne pas cocher** "Allow write access".

```bash
argocd repo add git@github.com:tahiryrlzf/tahiry-cloud-platform.git \
  --ssh-private-key-path ~/.ssh/argocd_deploy_key
```

## Désactiver `admin`

```bash
kubectl -n argocd patch configmap argocd-cm --type merge \
  -p '{"data":{"accounts.ops":"apiKey, login"}}'
# hash bcrypt : htpasswd -bnBC 10 "" "<password>" | tr -d ':\n'
kubectl -n argocd patch secret argocd-secret --type merge \
  -p '{"stringData":{"accounts.ops.password":"<bcrypt-hash>"}}'
kubectl -n argocd patch configmap argocd-cm --type merge \
  -p '{"data":{"accounts.admin.enabled":"false"}}'
kubectl -n argocd rollout restart deployment argocd-server
```

## Premier sync (manuel)

```bash
kubectl apply -k kubernetes/argocd/
argocd app diff socle-prod
argocd app sync socle-prod
argocd app sync portfolio-prod
# idem staging

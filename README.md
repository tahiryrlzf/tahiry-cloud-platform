# tahiry-cloud-platform

[![validate](https://github.com/tahiryrlzf/tahiry-cloud-platform/actions/workflows/lint.yml/badge.svg)](https://github.com/tahiryrlzf/tahiry-cloud-platform/actions/workflows/lint.yml)
[![build-app](https://github.com/tahiryrlzf/tahiry-cloud-platform/actions/workflows/build-app.yml/badge.svg)](https://github.com/tahiryrlzf/tahiry-cloud-platform/actions/workflows/build-app.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Infra et plateforme : Ansible pour le provisionnement, k3s pour Kubernetes,
ArgoCD pour le GitOps, Sealed Secrets pour les secrets, CI GitHub Actions.

## Architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│  INTERNET                                                            │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│  CLOUDFLARE (DNS + Proxy, SSL Full strict)                           │
│  tahiry-cloud.com / staging.tahiry-cloud.com                         │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│  VPS1 — tahiry-cloud-edge-hub                                        │
│  WireGuard : 10.10.0.1  (HUB)                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Traefik (edge)  :80  :443                                     │  │
│  │    ├── Let's Encrypt (HTTP-01)                                 │  │
│  │    └── Router → vps2 (10.10.0.2)                               │  │
│  │                                                                │  │
│  │  WireGuard (hub)  UDP 51820                                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──┬──────────────────┬──────────────────┬─────────────────────────────┘
   │                  │                  │
   │ WireGuard        │ WireGuard        │ WireGuard (pair désactivé)
   │                  │                  │
   ▼                  ▼                  ▼
┌────────────┐  ┌────────────┐  ┌──────────────────────┐
│  VPS2      │  │  WSL       │  │  pfSense             │
│ 10.10.0.2  │  │ 10.10.0.6  │  │  10.10.0.5           │
│            │  │            │  │                      │
│ k3s        │  │ Poste      │  │  Lab on-prem         │
│ prod       │  │ d'ops      │  │  Suspendu,           │
│ staging    │  │            │  │  réutilisable        │
│            │  │            │  │                      │
│ ArgoCD     │  │            │  └──────────────────────┘
│ Sealed     │  │            │
│   Secrets  │  │            │
└────────────┘  └────────────┘
```

`prod` et `staging` sont deux namespaces sur le même k3s.

Les IP WireGuard sont privées (`10.10.0.0/24`), non routables depuis Internet.
Aucune clé privée, PSK ou token n'est versionné.

## Rôles

- **Ansible** : installe k3s et crée le socle Kubernetes initial
  (namespaces, quotas, NetworkPolicies, PSA) avant ArgoCD.
- **ArgoCD** : maintient le socle et déploie le portfolio depuis Git.
- **Sealed Secrets** : chiffre les secrets versionnés.
- **GitHub Actions** : lint, détection de secrets (Gitleaks), build des
  images, scan Trivy, push GHCR.

Au démarrage, Ansible déployait aussi le portfolio via un playbook.
Depuis qu'ArgoCD gère le déploiement, ce playbook est désactivé (`03-deploy-portfolio.yml.disabled`). 
Il reste dans le repo pour référence historique.

## Contenu

```
apps/portfolio/     frontend Astro + backend Go + PostgreSQL
ansible/            provisionnement
inventory/lab/      exemple d'inventaire
kubernetes/
  bootstrap/        installation ArgoCD et Sealed Secrets
  argocd/           AppProject + Applications
  namespaces/       PSA, NetworkPolicies, quotas
  base/             Deployments, Services, StatefulSet postgres
  overlays/         Ingress et SealedSecrets prod/staging
scripts/            helpers
```

## État

- k3s sur VPS2 : opérationnel.
- Ansible (k3s, namespaces) : opérationnel.
- Socle k8s (PSA, NetworkPolicies, quotas) : opérationnel.
- Frontend, backend, PostgreSQL : opérationnels.
- CI (lint, Gitleaks, build, scan Trivy, push GHCR) : opérationnelle.
- ArgoCD (GitOps) et Sealed Secrets : opérationnels.
- Restauration testée : à faire.

## Limites

- k3s sur un seul nœud : un seul domaine de panne.
- VPS1 fait à la fois edge et hub WireGuard.
- `prod` et `staging` partagent le noyau, le plan de contrôle et les ressources.
- PostgreSQL mono-instance, sans réplication.
- Sauvegarde stateful non automatisée.

export const site = {
  name: "Tahiry",
  title: "Tahiry — Cloud / DevOps / DevSecOps / SRE",
  description: "Infrastructure hybride, sécurisée et automatisée. Cloud, Kubernetes, GitOps, sécurité.",
  url: "https://tahiry-cloud.com",

  links: {
    github: "https://github.com/tahiryrlzf",
    linkedin: "https://www.linkedin.com/in/",
    email: "contact@tahiry-cloud.com",
    staging: "https://staging.tahiry-cloud.com",
    platformRepo: "https://github.com/tahiryrlzf/tahiry-cloud-platform",
  },

  hero: {
    eyebrow: "Cloud / DevOps / DevSecOps / SRE",
    headline: "Infrastructure hybride, sécurisée, automatisée.",
    lede: "Administrateur systèmes et réseaux en transition vers le Cloud et la sécurité. Je construis et documente une plateforme réelle : réseau, Kubernetes, GitOps, observabilité.",
    ctas: [
      { label: "Voir les projets", href: "#projects", variant: "primary" },
      { label: "Lire le journal", href: "#journal", variant: "secondary" },
    ],
  },

  projects: [
    {
      name: "tahiry-cloud-platform",
      tagline: "Plateforme hybride, GitOps, sécurisée",
      description: "Cluster k3s single-node, edge Traefik, hub WireGuard, ArgoCD, Sealed Secrets, CI DevSecOps avec Trivy et gitleaks.",
      tags: ["WireGuard", "k3s", "Traefik", "ArgoCD", "Sealed Secrets", "Trivy"],
      href: "https://github.com/tahiryrlzf/tahiry-cloud-platform",
      status: "live",
    },
    {
      name: "SOC Lab",
      tagline: "Détection et réponse à incidents",
      description: "Lab de détection avec Wazuh, collecte de logs et scénarios MITRE ATT&CK. Projet séparé, à venir.",
      tags: ["Wazuh", "MITRE", "SIEM"],
      href: "#",
      status: "planned",
    },
  ],

  skills: [
    { domain: "Cloud", items: ["Contabo", "AWS (bases)", "Debian/Ubuntu"] },
    { domain: "CI/CD", items: ["GitHub Actions", "Jenkins (ancien)"] },
    { domain: "Kubernetes", items: ["k3s", "Helm", "Kustomize", "ArgoCD"] },
    { domain: "IaC", items: ["Ansible", "OpenTofu (à venir)"] },
    { domain: "Réseau & Sécurité", items: ["WireGuard", "Traefik", "ufw", "fail2ban", "Sealed Secrets"] },
    { domain: "Observabilité", items: ["Prometheus (à venir)", "Grafana (à venir)", "Loki (à venir)"] },
  ],

  journal: [
    { date: "2026-10-09", title: "Retour d'expérience : migration Ansible → ArgoCD", href: "#" },
    { date: "2026-10-08", title: "Hub-and-spoke WireGuard entre 3 machines", href: "#" },
    { date: "2026-10-07", title: "Durcir les namespaces k8s : PSA restricted, NetworkPolicies, quotas", href: "#" },
  ],
} as const;

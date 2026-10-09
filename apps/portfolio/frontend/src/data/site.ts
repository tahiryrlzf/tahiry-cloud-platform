export const site = {
  name: "Tahiry Frédéric",
  title: "Tahiry Frédéric — Cloud / DevOps / DevSecOps",
  description:
    "Infrastructure hybride, sécurisée et automatisée. Cloud, Kubernetes, GitOps, sécurité.",
  url: "https://tahiry-cloud.com",

  links: {
    github: "https://github.com/tahiryrlzf",
    linkedin: "",
    email: "contact@tahiry-cloud.com",
    staging: "https://staging.tahiry-cloud.com",
  },

  hero: {
    eyebrow: "Cloud / DevOps / DevSecOps",
    headline: "Infrastructure hybride, sécurisée, automatisée.",
    lede1: "Administrateur systèmes et réseaux avec plus de 5 ans d'expérience en production et titulaire d'un Master 2 en Réseaux & Systèmes, je possède une solide expérience en virtualisation, réseaux, sécurité des infrastructures et supervision (VMware, Sophos, pfSense, Active Directory, Zabbix).",
    lede2: "J'évolue aujourd'hui vers le Cloud, le DevOps et le DevSecOps en concevant et documentant des plateformes techniques intégrant l'Infrastructure as Code (IaC), Kubernetes, la CI/CD, la sécurité et l'observabilité.",
    ctas: [
      { label: "Voir les projets", href: "#projects", variant: "primary" },
      { label: "Voir le parcours", href: "#skills", variant: "secondary" },
      { label: "GitHub", href: "https://github.com/tahiryrlzf", variant: "secondary" },
      { label: "Me contacter", href: "mailto:contact@tahiry-cloud.com?subject=Contact%20depuis%20tahiry-cloud.com", variant: "secondary" },
    ],
  },

  projects: [
    {
      name: "tahiry-cloud-onprem",
      tagline: "Lab on-prem : cluster k3s one-prime",
      description:
        "Lab décommissionné : pfSense, VLANs 802.1Q, cluster k3s « one-prime » qui a hébergé mon portfolio, puis migration vers VPS2 avec Ansible. Conservé comme référence.",
      tags: ["one-prime", "pfSense", "802.1Q", "k3s", "Ansible", "WireGuard"],
      href: "https://github.com/tahiryrlzf/tahiry-cloud-onprem",
      status: "done" as const,
    },
    {
      name: "tahiry-cloud-platform",
      tagline: "Plateforme hybride, GitOps, sécurisée",
      description:
        "Cluster k3s single-node, edge Traefik, hub WireGuard, ArgoCD, Sealed Secrets, CI DevSecOps avec Trivy et gitleaks, NetworkPolicies, PSA restricted.",
      tags: ["WireGuard", "k3s", "Traefik", "ArgoCD", "Sealed Secrets", "Trivy"],
      href: "",
      status: "wip" as const,
    },
    {
      name: "SOC Lab",
      tagline: "Détection et réponse à incidents",
      description:
        "Lab de détection : Wazuh, collecte de logs et scénarios MITRE ATT&CK. Projet séparé, à venir.",
      tags: ["Wazuh", "MITRE", "SIEM"],
      href: "",
      status: "planned" as const,
    },
  ],

  skills: [
    {
      domain: "Cloud / Kubernetes",
      items: [
        "k3s",
        "Helm",
        "Kustomize",
        "ArgoCD",
        "Docker",
        "Kubernetes (kubeadm)",
        "Contabo",
        "Debian/Ubuntu",
        "AWS (bases)",
      ],
    },
    {
      domain: "CI/CD & GitOps",
      items: ["GitHub Actions", "GHCR", "Trivy", "gitleaks"],
    },
    {
      domain: "IaC & automatisation",
      items: [
        "Ansible (rôles, Vault)",
        "Bash",
        "Python",
        "PowerShell",
        "Batch",
        "Cron",
      ],
    },
    {
      domain: "Réseau & sécurité",
      items: [
        "pfSense (production)",
        "Sophos XG (production)",
        "VLAN 802.1Q (production)",
        "Cisco switching (production)",
        "WireGuard (lab)",
        "IPsec Site-to-Site (production)",
        "SSL VPN (production)",
        "OpenVPN (production)",
        "Traefik",
        "Cloudflare",
        "Sealed Secrets",
        "NetworkPolicies",
        "PSA restricted",
        "ufw (en cours)",
        "fail2ban (en cours)",
      ],
    },
    {
      domain: "Supervision",
      items: [
        "Zabbix (en production)",
        "Prometheus (à venir)",
        "Grafana (à venir)",
      ],
    },
    {
      domain: "Virtualisation & cloud privé",
      items: [
        "VMware vCenter/ESXi (production)",
        "Proxmox (lab)",
        "KVM (lab)",
        "Apache CloudStack (lab)",
        "OpenStack (projet Master 2)",
      ],
    },
    {
      domain: "Systèmes",
      items: [
        "Linux",
        "Windows Server (production)",
        "Active Directory / GPO (production)",
        "Restic",
      ],
    },
  ],

  journal: [
    { title: "NetworkPolicy et 502 : isoler sans casser le routage", slug: "networkpolicy-502", published: false },
    { title: "CrashLoopBackOff : egress manquant vers PostgreSQL", slug: "crashloopbackoff-egress", published: false },
    { title: "Sealed Secrets : Resource already exists (secret créé par Ansible)", slug: "sealed-secrets-already-exists", published: false },
    { title: "VLAN 802.1Q sous VMware : tagging et trunk", slug: "vlan-8021q-vmware", published: false },
    { title: "WireGuard derrière un firewall prestataire", slug: "wireguard-firewall-prestataire", published: false },
    { title: "Idempotence Ansible : le cas swapoff", slug: "idempotence-ansible-swapoff", published: false },
  ],
} as const;

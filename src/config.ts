export const siteConfig = {
  name: "Jungwoo Suh",
  title: "Undergraduate Researcher",
  description: "Portfolio website of Jungwoo Suh",
  accentColor: "#1d4ed8",
  social: {
    email: "candorleo02@gmail.com",
    linkedin: "https://www.linkedin.com/in/jungwoo-suh-/",
    github: "https://github.com/glaubeleo-ruth",
  },
  aboutMe:
    "I work on representation learning and explainability for label-scarce, high-stakes data — applying self-supervised methods to medical image segmentation (TB chest X-ray, FUSeg) at IMSI Lab (SNU), with an Industrial Engineering background in optimization and data-driven decision systems (fleet routing, simulation, time-series forecasting). I'm drawn to problems where limited labels and interpretability both matter — the throughline connecting my medical imaging and operations research work.",
  researchInterests: [
    "Self-supervised representation learning",
    "Explainable anomaly detection",
    "Multi-task learning under label scarcity",
    "Time-series & multimodal biomedical signals",
  ],
  skills: [
    "Python",
    "PyTorch",
    "U-Net",
    "Medical Imaging",
    "Image Segmentation",
    "XGBoost",
    "Scikit-learn",
    "Gurobi",
    "MILP",
    "PuLP",
    "Arena",
    "Pandas",
    "NumPy",
    "R",
    "C++",
    "ROS2",
  ],
  projects: [
    {
      name: "Medical Image Segmentation (Ongoing)",
      description:
        "Undergraduate research at IMSI Lab (SNU) applying U-Net and ResNet architectures to segmentation tasks across TB chest X-ray and FUSeg foot ulcer datasets, addressing label-scarce clinical imaging conditions. Research in progress.",
      skills: ["PyTorch", "U-Net", "ResNet", "Medical Imaging"],
    },
    {
      name: "ML-MILP EV Fleet Optimization",
      description:
        "Integrated XGBoost energy prediction and MILP routing optimization for HVAC-aware electric vehicle fleet operations. Improved service level by 12%, reduced non-revenue operations by 37%, and achieved R²=0.94 on energy estimation across 135 evaluated scenarios. Involves sequential, time-dependent operational data relevant to time-series representation learning.",
      link: "https://github.com/glaubeleo-ruth/ml-milp-ev-fleet-optimization",
      skills: ["Python", "Gurobi", "XGBoost", "MILP"],
    },
    {
      name: "Food Delivery Delay Prediction",
      description:
        "Binary classification pipeline predicting delivery delays across ~15,000 orders. Compared KNN and XGBoost under 90/10 class imbalance. XGBoost achieved AUC-ROC 0.997 and F1 0.89 on the minority class via scale_pos_weight tuning. Team project (2 members).",
      link: "https://github.com/glaubeleo-ruth/food-delivery-delay-prediction",
      skills: ["Python", "XGBoost", "Scikit-learn", "Pandas"],
    },
    {
      name: "Distribution Center Simulation",
      description:
        "Led a 3-member team to model and improve distribution center operations using discrete-event simulation. Identified AGV routing as the primary throughput bottleneck via data-driven analysis and proposed optimized routing and buffer strategies to improve operational efficiency.",
      link: "https://github.com/glaubeleo-ruth/distribution-center-agv-simulation",
      skills: ["Arena", "Simulation Modeling"],
    },
  ],
  experience: [
    {
      company: "IMSI Lab, Seoul National University",
      title: "Undergraduate Researcher",
      dateRange: "Jun 2026 - Present",
      bullets: [
        "Contributing to CineFlow team research on chest X-ray classification, in progress toward journal submission (IEEE Access / ESWA)",
        "Supporting related work on skin condition analysis targeting ICCE-ASIA 2026 conference submission",
      ],
    },
    {
      company: "Illinois Institute of Technology",
      title: "Visiting Researcher — Optimization",
      dateRange: "Jan 2026 - Feb 2026",
      bullets: [
        "Developed XGBoost energy prediction model (R²=0.94), reducing estimation error by ±18%",
        "Improved fleet service level by 12% and reduced non-revenue operations by 37% through MILP routing",
        "Evaluated 135 scenarios to validate robustness of data-driven dispatch decisions",
      ],
    },
    {
      company: "Soongsil University",
      title: "Team Project — Distribution Center Simulation",
      dateRange: "Sep 2025 - Dec 2025",
      bullets: [
        "Led a 3-member team to analyze and improve distribution center operations using simulation modeling",
        "Identified AGV routing as the key bottleneck impacting throughput through data-driven analysis",
        "Improved operational efficiency by proposing optimized routing and buffer strategies",
      ],
    },
  ],
  education: [
    {
      school: "Soongsil University",
      degree: "B.Eng. Industrial Engineering",
      minor: "Double Major in AI-Convergence",
      dateRange: "Mar 2022 - Aug 2027 (Expected)",
      achievements: [
        "GPA 3.52 / 4.50",
        "TOEFL iBT 101 / 120",
        "Relevant coursework: Operations Research, Machine Learning, Algorithms, Simulation Modeling, Statistics",
      ],
    },
  ],
};

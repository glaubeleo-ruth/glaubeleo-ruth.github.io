interface Project {
  name: string;
  description: string;
  link?: string;
  skills: string[];
}

interface Experience {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
}

interface Education {
  school: string;
  degree: string;
  minor?: string;
  dateRange: string;
  achievements: string[];
}

interface SiteConfig {
  name: string;
  title: string;
  description: string;
  accentColor: string;
  social: {
    email: string;
    linkedin: string;
    github: string;
  };
  aboutMe: string;
  researchInterests: string[];
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

export const siteConfig: SiteConfig = {
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
    "I work at the intersection of mathematical optimization and machine learning, building decision systems that hold up under uncertainty. My Industrial Engineering background runs through fleet routing, discrete-event simulation, and demand forecasting — problems where a model is only useful if it survives contact with operational constraints. I'm drawn to work that couples a learned predictor to a solver, so that a forecast becomes a decision rather than a number.",
  researchInterests: [
    "Machine learning for combinatorial optimization",
    "Decision-making under uncertainty",
  ],
  skills: [
    "Python",
    "PyTorch",
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
      name: "ML-MILP EV Fleet Optimization",
      description:
        "Integrated XGBoost energy prediction and MILP routing optimization for HVAC-aware electric vehicle fleet operations. Improved service level by 12%, reduced non-revenue operations by 37%, and achieved R²=0.94 on energy estimation across 135 evaluated scenarios.",
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
      bullets: [],
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
        "Relevant coursework: Operations Research, Machine Learning, Data Structures, Algorithms, Computer Architecture, Operating Systems",
        "Advanced AI Mathematics, Multimodal Deep Learning, Simulation Modeling",
        "Probability & Statistics I·II, Linear Algebra, Engineering Mathematics I·II",
      ],
    },
  ],
};

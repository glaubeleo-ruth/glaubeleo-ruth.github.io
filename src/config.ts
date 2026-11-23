export interface Project {
  name: string;
  description: string;
  highlight?: string;
  context?: string;
  period?: string;
  slug?: string; // set only for Notion-sourced projects, which get a /projects/<slug> page
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
  title: "Optimization & Machine Learning Engineer",
  description:
    "Jungwoo Suh — optimization and machine learning for decisions under hard constraints, and careful evaluation of ML systems.",
  accentColor: "#1d4ed8",
  social: {
    email: "candorleo02@gmail.com",
    linkedin: "https://www.linkedin.com/in/jungwoo-suh-/",
    github: "https://github.com/glaubeleo-ruth",
  },
  aboutMe:
    "I work on decisions under hard constraints, from the data pipeline and prediction model to the optimizer and its comparison against a baseline. I've built a shipyard scheduling solver with logic-based Benders decomposition, a rolling-horizon MILP dispatcher for an electric shuttle fleet, and an evaluation setup for fine-tuning a vision-language model. Across all of them I measure first: I fix the baseline, check the metric and the grader, and count only the results that pass verification. I'm an Industrial Engineering and AI Convergence student at Soongsil University (graduating Aug 2027) and an undergraduate researcher at Seoul National University.",
  researchInterests: [
    "Machine learning for combinatorial optimization",
    "Decision-making under uncertainty",
    "Reliable evaluation of ML and vision-language models",
  ],
  skills: [
    "Python",
    "PyTorch",
    "Transformers",
    "vLLM",
    "LoRA",
    "XGBoost",
    "Scikit-learn",
    "Gurobi",
    "OR-Tools CP-SAT",
    "MILP",
    "PuLP",
    "Arena",
    "Pandas",
    "NumPy",
    "R",
    "C++",
  ],
  projects: [
    {
      name: "Shipyard Block Scheduling — OGC 2026",
      description:
        "Joint bay assignment, 2D placement of irregular polygonal blocks, and entry/exit timing for 100–250 blocks per instance. Built a logic-based Benders decomposition matheuristic with an ALNS portfolio; every output passes the official feasibility checker before it is returned. Developed with role-separated Claude Code agents for implementation, benchmarking, and verification. Team of 3, solver lead.",
      highlight: "Hidden-set objective −49% to −99.6% · 100% feasible · 36/40 training instances improved, 0 regressions",
      link: "https://github.com/glaubeleo-ruth/OGC_2026",
      skills: ["Python", "Gurobi", "OR-Tools CP-SAT", "Benders decomposition", "ALNS"],
    },
    {
      name: "Vision-Language Model Evaluation & Fine-Tuning",
      description:
        "Improving Qwen3-VL-4B on the MMMU benchmark. Measured seed-to-seed variance before training, reported strict and pipeline scores side by side, and caught an LLM grader that marked short correct answers wrong. Tested connector training, external-data LoRA, 32B→4B distillation, DPO, and self-generated-solution SFT against the same baseline. Team of 4, team lead.",
      highlight: "+5.7 pp from evaluation setup alone · truncated answers 88 → 45 · MMMU-Pro 54.08 → 55.14",
      link: "https://github.com/tangerlyn/Multimodal_project",
      skills: ["PyTorch", "Transformers", "LoRA", "DPO", "vLLM"],
    },
    {
      name: "EV Shuttle Dispatch — ML Energy Prediction + MILP",
      description:
        "Six-stage pipeline: discrete-event simulation of an autonomous electric shuttle fleet, a Random Forest trip-energy model, and a rolling-horizon MILP dispatcher compared against a nearest-vehicle baseline across 135 scenarios. The ML and fixed-rate energy models gave identical dispatch outcomes, so the gain comes from the optimizer.",
      highlight: "Service rate 35.3% → 64.6% · deadhead −74% · energy model R² 0.989",
      link: "https://github.com/glaubeleo-ruth/ml-milp-ev-fleet-optimization",
      skills: ["Python", "PuLP", "Gurobi", "Scikit-learn", "MILP"],
    },
    {
      name: "Food Delivery Delay Prediction",
      description:
        "Late-delivery classification on ~15,000 orders with 90/10 class imbalance. Showed that a 90%-accuracy KNN had AUC 0.54, then handled imbalance with scale_pos_weight and engineered traffic, weather, and peak-hour features for XGBoost. Team of 2.",
      highlight: "AUC-ROC 0.997 · delayed-class F1 0.89",
      link: "https://github.com/glaubeleo-ruth/food-delivery-delay-prediction",
      skills: ["Python", "XGBoost", "Scikit-learn", "Pandas"],
    },
    {
      name: "Distribution Center Simulation",
      description:
        "Arena discrete-event model of a distribution center with closed-loop stock synchronization and AGV transporters. Found that transporters back up at the packing process, with an average of 16.4 entities waiting at the transporter call point, and proposed parallel packing stations and more transporters. Team of 3, team lead.",
      link: "https://github.com/glaubeleo-ruth/distribution-center-agv-simulation",
      skills: ["Arena", "Discrete-event simulation"],
    },
  ],
  experience: [
    {
      company: "IMSI Lab, Seoul National University",
      title: "Undergraduate Researcher",
      dateRange: "Jun 2026 - Present",
      bullets: [
        "Co-authored a controlled study of anatomical guidance in sparse-view X-ray-to-CT reconstruction (Gaussian splatting, 600 CT cases), accepted at IEEE ICCE 2027",
        "Contributed to a three-scale evaluation: whole volume, held-out 30°/60° reprojection, and 1,185 annotated nodules",
        "D. Kweon, K. Kim, J. Suh, et al., \"Anatomical Support in Sparse-View X-ray-to-CT Reconstruction: A Controlled Gaussian Splatting Study,\" accepted at IEEE ICCE 2027",
      ],
    },
    {
      company: "Illinois Institute of Technology",
      title: "Undergraduate Research Intern (SURE) — Optimization",
      dateRange: "Jan 2026 - Feb 2026",
      bullets: [
        "Raised trip service rate from 35.3% to 64.6% and cut deadhead distance 74% (787 to 204 km) vs a nearest-vehicle baseline with a rolling-horizon MILP dispatcher",
        "Built a trip-level energy prediction model (Random Forest vs XGBoost, 5-fold CV; R² 0.989, MAPE 3.3%) on 9,473 simulated trips",
        "Ran a 135-scenario sensitivity analysis over fleet size, decision interval, objective weights, and temperature",
      ],
    },
    {
      company: "Soongsil University",
      title: "Team Lead — Distribution Center Simulation",
      dateRange: "Sep 2025 - Dec 2025",
      bullets: [
        "Led a 3-person team modeling distribution center throughput with discrete-event simulation (Arena)",
        "Identified the packing process as the primary bottleneck (average queue of 16.4) and proposed parallel packing stations and additional transporters",
      ],
    },
  ],
  education: [
    {
      school: "Soongsil University",
      degree: "B.Eng. Industrial Engineering",
      minor: "Double Major in AI Convergence",
      dateRange: "Mar 2022 - Aug 2027 (Expected)",
      achievements: [
        "Relevant coursework: Operations Research, Machine Learning, Multimodal Deep Learning, Advanced AI Mathematics, Simulation Modeling",
        "Probability & Statistics I·II, Linear Algebra, Data Structures, Algorithms, Computer Architecture, Operating Systems",
      ],
    },
  ],
};

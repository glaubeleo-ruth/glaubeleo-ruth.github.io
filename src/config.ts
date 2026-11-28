export interface Metric {
  value: string;
  label: string;
  highlight?: boolean;
}

export interface DetailSection {
  title: string;
  body?: string;
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  cards?: { title: string; body: string; note?: string }[];
  figure?: { src: string; alt: string; caption?: string };
}

export interface ProjectDetail {
  problem: string;
  approach?: string;
  contributions: string[];
  metrics: Metric[];
  sections: DetailSection[];
  lesson?: string;
}

export interface Project {
  name: string;
  description: string;
  highlight?: string;
  context?: string;
  period?: string;
  team?: string;
  role?: string;
  // Notion-sourced projects get /projects/<slug>; config projects with `detail` get /work/<slug>.
  slug?: string;
  link?: string;
  skills: string[];
  detail?: ProjectDetail;
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

interface Principle {
  title: string;
  body: string;
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
  principles: Principle[];
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
    "I solve operational problems with hard constraints end to end, from the data pipeline and prediction model to the optimizer. I always compare results against a baseline and report only numbers that passed verification. I've built a shipyard scheduling solver with logic-based Benders decomposition, a rolling-horizon MILP dispatcher for an electric shuttle fleet, and an evaluation setup for fine-tuning a vision-language model. I'm an Industrial Engineering and AI Convergence student at Soongsil University (graduating Feb 2028) and an undergraduate researcher at Seoul National University.",
  principles: [
    {
      title: "Set the baseline first",
      body: "An improvement only means something next to a comparison. I compared the dispatcher against nearest-vehicle assignment, and each solver version against the previous one on the same instances.",
    },
    {
      title: "Question the metric",
      body: "On imbalanced data, 90% accuracy can say nothing. I pick the metric that fits the problem before comparing models, and I check automated graders before trusting them.",
    },
    {
      title: "Trust only verified results",
      body: "Even when a solver or an AI agent reported an improvement, I kept it only after it passed the official checker and repeated measurement. Failed experiments get reported too.",
    },
  ],
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
        "Joint bay assignment, 2D placement of irregular polygonal blocks, and entry/exit timing for 100–250 blocks per instance. A logic-based Benders decomposition matheuristic runs alongside an ALNS portfolio, and only solutions that pass the official checker are returned. Built with role-separated AI agents.",
      highlight: "Hidden-set objective −49% to −99.6% · 100% feasible · 36/40 training instances improved, 0 regressions",
      context: "Optimization Grand Challenge 2026 · Team SANDLE",
      period: "Jun – Jul 2026",
      team: "Team of 2",
      role: "Solver design & implementation lead",
      slug: "shipyard-block-scheduling",
      link: "https://github.com/glaubeleo-ruth/OGC_2026",
      skills: ["Python", "Gurobi", "OR-Tools CP-SAT", "Benders decomposition", "ALNS"],
      detail: {
        problem:
          "A shipyard has several fixed bays and 100–250 ship blocks per instance. For every block the solver decides which bay it goes to, where it sits and in which orientation, and on which days it enters and leaves, so that blocks sharing a bay never overlap. Blocks are stacks of non-convex polygons, so even the overlap test is expensive. The objective weighs tardiness, workload balance across bays, and bay preference, and every run must return a feasible schedule within its 60–900 second limit.",
        approach:
          "Two solver lines share one time budget. A logic-based Benders decomposition solves bay assignment and timing exactly while ignoring geometry; a per-bay packing oracle then tries to place the blocks and, when a plan does not fit, returns the reason as a cut. An adaptive large neighborhood search runs in the remaining time as a hedge for instance types the newer line has never seen. Whatever is returned has passed the official feasibility checker first.",
        contributions: [
          "Designed the overall architecture: LBBD and ALNS lines inside one time budget",
          "Implemented the assignment master (MIP), the per-bay packing oracle, and the repair tiers",
          "Built the pre-output audit against the official checker and the timeout safeguards",
          "Built the 40-instance benchmark harness and ran regression checks before every submission",
        ],
        metrics: [
          { value: "−49% to −99.6%", label: "Hidden-set objective, first accepted entry → final", highlight: true },
          { value: "61.6M → 220K", label: "Instance P3 objective (lower is better)" },
          { value: "100%", label: "Feasible on every official evaluation and all 40 training instances" },
          { value: "36 / 40", label: "Training instances improved, 0 regressions" },
        ],
        sections: [
          {
            title: "What an instance looks like",
            figure: {
              src: "/work/ogc-instance.png",
              alt: "Training instance prob_1: two bays, block footprints, and release-to-due windows for 100 blocks",
              caption: "Training instance prob_1: 2 bays and 100 blocks. Middle: block footprints (darker = upper layer). Right: each block's release-to-due window.",
            },
          },
          {
            title: "Agent harness: implementation and verification kept apart",
            body: "I set the direction, and three Claude Code agents with fixed permissions did the work. Agent reports were never taken at face value: a reported improvement counted only after it passed the official checker and at least five repeated measurements. The pre-submission check found and fixed two time-limit bugs.",
            cards: [
              { title: "Implementation agent", body: "Implements only the agreed change and self-checks feasibility.", note: "Cannot judge performance" },
              { title: "Benchmark agent", body: "Runs A/B measurements, repeated runs, and the full pre-submission sweep.", note: "Cannot edit solver code" },
              { title: "Verification agent", body: "Tries to refute key claims with measurements and hunts regressions at each commit.", note: "Cannot edit solver code" },
            ],
          },
          {
            title: "Results",
            figure: {
              src: "/work/ogc-results.png",
              alt: "Hidden-set objective by submission, and training-set comparison of the previous and final solver versions",
              caption: "Left: hidden-set objective by accepted submission (log scale). Right: previous version (gray) vs final version (blue) on the 40 training instances. On one instance the result matched the best objective among 958 registered teams; on structured instances the solver proved optimality.",
            },
          },
        ],
        lesson:
          "When the first submission scored 61.6M on one instance, I didn't just swap algorithms. I first built a way to tell which changes really helped, and every later improvement was measured against it.",
      },
    },
    {
      name: "EV Shuttle Dispatch — ML Energy Prediction + MILP",
      description:
        "Six-stage pipeline: discrete-event simulation of an autonomous electric shuttle fleet, a Random Forest trip-energy model, and a rolling-horizon MILP dispatcher compared against a nearest-vehicle baseline across 135 scenarios.",
      highlight: "Service rate 35.3% → 64.6% · deadhead −74% · energy model R² 0.989",
      context: "Illinois Institute of Technology · SURE Program",
      period: "Jan – Feb 2026",
      team: "Solo research",
      role: "Designed and built the full pipeline",
      slug: "ev-shuttle-dispatch",
      link: "https://github.com/glaubeleo-ruth/ml-milp-ev-fleet-optimization",
      skills: ["Python", "PuLP", "Gurobi", "Scikit-learn", "MILP"],
      detail: {
        problem:
          "An autonomous electric shuttle fleet serves passengers on the IIT campus. The dispatcher decides which vehicle takes each request and when vehicles charge. Heating and cooling loads change with temperature, so the same route can cost different energy, and a fixed energy rate can produce assignments a battery cannot finish.",
        approach:
          "I simulated one operating day with discrete-event simulation to generate 9,473 trips, trained a model to predict each trip's energy, and fed the predictions to the dispatch MILP as a feasibility filter. The MILP is re-solved every few minutes (rolling horizon). Every scenario is compared against nearest-vehicle assignment on the same demand.",
        contributions: [
          "Built the six-stage pipeline: simulation → energy prediction → MILP → scenario sweep → analysis",
          "Compared Random Forest and XGBoost with 5-fold cross-validation",
          "Formulated the dispatch and charging MILP and implemented the greedy baseline",
          "Ran a 135-scenario sensitivity analysis over fleet size, decision interval, objective weights, and temperature",
          "Wrote the research report and the MILP formulation document",
        ],
        metrics: [
          { value: "35.3% → 64.6%", label: "Service rate vs nearest-vehicle baseline (135-scenario mean)", highlight: true },
          { value: "787 → 204 km", label: "Deadhead (empty) distance, −74%" },
          { value: "1,749 → 269 s", label: "Average passenger wait" },
          { value: "R² 0.989", label: "Energy model (Random Forest), MAPE 3.3%" },
        ],
        sections: [
          {
            title: "Service rate by fleet size",
            table: {
              headers: ["Fleet size", "MILP", "Nearest-vehicle baseline"],
              rows: [
                ["5", "39.9%", "17.0%"],
                ["8", "56.9%", "27.8%"],
                ["10", "66.5%", "35.2%"],
                ["12", "74.7%", "42.8%"],
                ["15", "84.8%", "53.8%"],
              ],
            },
          },
        ],
        lesson:
          "The MILP with the learned energy model and the MILP with a fixed energy rate produced identical results in all 135 scenarios. The gain came from the optimizer; in this scenario range, a more accurate energy estimate changed no decision. Whether a model is accurate and whether it changes a decision are separate questions, and both need checking.",
      },
    },
    {
      name: "Sparse-View X-ray-to-CT Reconstruction Study",
      description:
        "A controlled study of whether anatomical guidance improves CT reconstruction from a few X-ray views (Gaussian splatting, 600 CT cases), evaluated at three scales down to 1,185 annotated nodules. Accepted at IEEE ICCE 2027.",
      highlight: "Whole-volume MAE 0.0845 → 0.0326 · PSNR 18.17 → 25.42 dB",
      context: "IMSI Lab, Seoul National University · IEEE ICCE 2027",
      period: "Jun 2026 – present",
      team: "12 co-authors",
      role: "3rd author, evaluation",
      slug: "sparse-view-ct-study",
      skills: ["Gaussian splatting", "Medical imaging", "Evaluation"],
      detail: {
        problem:
          "Sparse-view reconstruction rebuilds a 3D CT volume from only a few X-ray projections. The study asks, under controlled conditions, whether giving the reconstruction anatomical guidance actually improves it. Gaussian-splatting reconstruction was applied to 600 CT cases.",
        approach:
          "A single average metric hides where reconstruction gets better or worse, so the evaluation was split into three scales.",
        contributions: [
          "Contributed to the three-scale evaluation",
          "Took part in organizing results and writing the paper as a co-author",
        ],
        metrics: [
          { value: "0.0845 → 0.0326", label: "Whole-volume MAE (lower is better)", highlight: true },
          { value: "18.17 → 25.42 dB", label: "Whole-volume PSNR (higher is better)", highlight: true },
          { value: "1,185", label: "Annotated nodules evaluated one by one" },
          { value: "600", label: "CT cases" },
        ],
        sections: [
          {
            title: "Three-scale evaluation",
            cards: [
              { title: "1 · Whole volume", body: "The full reconstructed 3D volume compared against ground-truth CT (MAE, PSNR)." },
              { title: "2 · Held-out reprojection", body: "Reprojected at 30° and 60° angles not used for fitting." },
              { title: "3 · Nodule level", body: "1,185 annotated lung nodules evaluated individually." },
            ],
          },
          {
            title: "Publication",
            body: "D. Kweon, K. Kim, J. Suh, et al., \"Anatomical Support in Sparse-View X-ray-to-CT Reconstruction: A Controlled Gaussian Splatting Study,\" accepted at IEEE ICCE 2027.",
          },
        ],
        lesson:
          "A better overall average can hide worse results in small regions. Splitting evaluation from the whole volume down to individual nodules carries over to any problem where small segments need their own check.",
      },
    },
    {
      name: "Vision-Language Model Evaluation & Fine-Tuning",
      description:
        "Improving Qwen3-VL-4B on the MMMU benchmark. Measured seed-to-seed variance before training, caught an LLM grader that marked short correct answers wrong, and tested five fine-tuning hypotheses against the same baseline.",
      highlight: "+5.7 pp from evaluation setup alone · truncated answers 88 → 45 · MMMU-Pro 54.08 → 55.14",
      context: "Multimodal Deep Learning team project",
      period: "Sep – Dec 2026",
      team: "Team of 4",
      role: "Team lead · evaluation and final training design",
      slug: "vlm-evaluation-fine-tuning",
      link: "https://github.com/tangerlyn/Multimodal_project",
      skills: ["PyTorch", "Transformers", "LoRA", "DPO", "vLLM"],
      detail: {
        problem:
          "Fine-tune a 4B-parameter vision-language model (Qwen3-VL-4B) to score higher on MMMU, a college-level multimodal benchmark. Answers combine an image and a question and are written out in full, so how the output is graded drives the result as much as the model does.",
        approach:
          "We tested hypotheses one at a time (connector training, input resolution, adapters, external data, teacher distillation, DPO, and self-generated-solution SFT) and compared every one against a baseline measured in the same environment. Four members ran separate tracks in parallel.",
        contributions: [
          "Led the 4-person team and coordinated each member's experiment track",
          "Designed the evaluation setup (prompt, output limit, resolution, scoring rules) and the error analysis",
          "Implemented the final design, H-SFT: training on the model's own correct solutions",
          "Ran paired per-question tests and a reproduction from a clean environment",
        ],
        metrics: [
          { value: "+5.7 pp", label: "From evaluation setup alone, no training (59.56 → 65.22%)", highlight: true },
          { value: "88 → 45", label: "Answers cut off at the output limit (p < 0.0001)" },
          { value: "54.08 → 55.14", label: "MMMU-Pro average accuracy (%)" },
          { value: "63.63%", label: "MMMU test, 10,500 questions (final model)" },
        ],
        sections: [
          {
            title: "Hypotheses and results, against the same-environment baseline",
            table: {
              headers: ["Hypothesis", "Result", "Verdict"],
              rows: [
                ["Training the vision connector improves diagram reading", "Did not beat input upscaling (no training)", "The bottleneck is not the connector"],
                ["LoRA on external datasets' solutions", "Mostly worse (down to about −13 pp)", "Breaks the model's own solving style"],
                ["Distill from a 32B teacher", "65.56 → 62.78%", "Worse even on fully answered questions (p = 0.011)"],
                ["DPO on correct/incorrect pairs", "65.56 → 65.33%, more truncation", "No effect"],
                ["SFT on the model's own correct solutions (H-SFT)", "Same accuracy, half the truncation", "Adopted as the final model"],
              ],
            },
          },
          {
            title: "Checking the measurement before the model",
            bullets: [
              "Baseline variance: the same model moved between 64.22% and 65.78% with only the seed changed, flipping 134 questions. Differences inside that band were not counted as improvements; changes were judged with paired tests and multiple seeds.",
              "Scoring rules in the open: reported the official-parser score (63.00%) next to the pipeline score (65.22%), and counted what the extra rules gained (24) and lost (11).",
              "LLM grader check: the Qwen2.5-7B grader for long-form engineering answers marked short correct answers such as \"Answer: M12\" as wrong. Keeping the model and decoding fixed, a revised rubric judged by the key fact; the 16 items where the two rubrics disagreed were set aside for human grading.",
              "Error breakdown: answers that wrote out a solution were 81% correct versus 55.5% for answer-only output, which pointed to the prompt rather than the model. Two teammates cross-tagged 68 engineering errors; 85% fell into visual reading, reasoning, or domain knowledge.",
              "Image dependence: removing images dropped accuracy from 65.56% to 46.22%. Reproduction from the public package in a clean Colab gave 67.00% (originally 66.44%) and surfaced a script bug, which was fixed.",
            ],
          },
        ],
        lesson:
          "H-SFT's accuracy gain on MMMU val was not statistically significant (p = 0.67). The drop in truncation was clear, and on questions both models finished, accuracy was the same. So the conclusion was not \"the model got smarter\" but \"it finishes its answers more often.\"",
      },
    },
    {
      name: "Food Delivery Delay Prediction",
      description:
        "Late-delivery classification on ~15,000 orders with 90/10 class imbalance. Showed that a 90%-accuracy KNN had AUC 0.54, then handled imbalance with scale_pos_weight and engineered traffic, weather, and peak-hour features for XGBoost.",
      highlight: "AUC-ROC 0.997 · delayed-class F1 0.89",
      context: "Machine Learning course project",
      period: "2025",
      team: "Team of 2",
      role: "Model comparison, imbalance handling, features",
      slug: "food-delivery-delay",
      link: "https://github.com/glaubeleo-ruth/food-delivery-delay-prediction",
      skills: ["Python", "XGBoost", "Scikit-learn", "Pandas"],
      detail: {
        problem:
          "Of about 15,000 orders, only 9.5% were delayed. A KNN model reached 90% accuracy, yet its AUC was 0.54 and its delayed-class F1 was 0.01: it caught almost no delays.",
        contributions: [
          "Switched the evaluation from accuracy to AUC and delayed-class F1",
          "Handled imbalance with scale_pos_weight instead of resampling",
          "Engineered a traffic/weather stress score, peak-hour flags, and related features",
        ],
        metrics: [
          { value: "0.54", label: "AUC of the 90%-accuracy KNN" },
          { value: "0.997", label: "XGBoost AUC-ROC", highlight: true },
          { value: "0.89", label: "XGBoost delayed-class F1", highlight: true },
          { value: "~15,000", label: "Orders, 9.5% delayed" },
        ],
        sections: [
          {
            title: "KNN vs XGBoost on the test set",
            figure: {
              src: "/work/food-model-comparison.png",
              alt: "Accuracy, AUC-ROC, and delayed-class F1 for KNN and XGBoost",
              caption: "The accuracy gap is small; the AUC and delayed-class F1 gaps are not.",
            },
          },
        ],
      },
    },
    {
      name: "Distribution Center Simulation",
      description:
        "Arena discrete-event model of a distribution center with closed-loop stock synchronization and AGV transporters. Found that transporters back up at the packing process (average of 16.4 waiting at the transporter call point) and proposed parallel packing stations and more transporters.",
      context: "System Simulation course project",
      period: "Sep – Dec 2025",
      team: "Team of 3",
      role: "Team lead",
      link: "https://github.com/glaubeleo-ruth/distribution-center-agv-simulation",
      skills: ["Arena", "Discrete-event simulation"],
    },
    {
      name: "On-Device Speech Recognition Benchmark",
      description:
        "Measured whether quantization actually speeds up Whisper on device, using a fixed set of 200 LibriSpeech utterances. On an Apple M2, PyTorch dynamic int8 quantization ran about 1.4× slower than fp32.",
      context: "Course project (in progress)",
      period: "2026",
      team: "Team of 4",
      role: "Member, benchmark measurements",
      skills: ["PyTorch", "Transformers"],
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
      dateRange: "Mar 2022 - Feb 2028 (Expected)",
      achievements: [
        "Relevant coursework: Operations Research, Machine Learning, Multimodal Deep Learning, Advanced AI Mathematics, Simulation Modeling",
        "Probability & Statistics I·II, Linear Algebra, Data Structures, Algorithms, Computer Architecture, Operating Systems",
      ],
    },
  ],
};

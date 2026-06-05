export type MuscleGroup =
  | "peito"
  | "costas"
  | "ombros"
  | "biceps"
  | "triceps"
  | "quadriceps"
  | "posterior"
  | "gluteos"
  | "panturrilha"
  | "abdomen";

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  equipment: string;
}

export const EXERCISES: Exercise[] = [
  // Peito
  { id: "supino-reto-barra", name: "Supino reto com barra", group: "peito", equipment: "barra" },
  { id: "supino-inclinado-halteres", name: "Supino inclinado com halteres", group: "peito", equipment: "halteres" },
  { id: "crucifixo-halteres", name: "Crucifixo com halteres", group: "peito", equipment: "halteres" },
  { id: "crossover", name: "Crossover no cabo", group: "peito", equipment: "cabo" },
  { id: "flexao", name: "Flexão de braço", group: "peito", equipment: "peso corporal" },

  // Costas
  { id: "puxada-frontal", name: "Puxada frontal", group: "costas", equipment: "polia" },
  { id: "remada-curvada", name: "Remada curvada", group: "costas", equipment: "barra" },
  { id: "remada-baixa", name: "Remada baixa no cabo", group: "costas", equipment: "cabo" },
  { id: "barra-fixa", name: "Barra fixa", group: "costas", equipment: "peso corporal" },
  { id: "pulldown", name: "Pulldown braço reto", group: "costas", equipment: "cabo" },

  // Ombros
  { id: "desenvolvimento-halteres", name: "Desenvolvimento com halteres", group: "ombros", equipment: "halteres" },
  { id: "desenvolvimento-militar", name: "Desenvolvimento militar", group: "ombros", equipment: "barra" },
  { id: "elevacao-lateral", name: "Elevação lateral", group: "ombros", equipment: "halteres" },
  { id: "elevacao-frontal", name: "Elevação frontal", group: "ombros", equipment: "halteres" },
  { id: "face-pull", name: "Face pull", group: "ombros", equipment: "cabo" },

  // Bíceps
  { id: "rosca-direta", name: "Rosca direta", group: "biceps", equipment: "barra" },
  { id: "rosca-alternada", name: "Rosca alternada", group: "biceps", equipment: "halteres" },
  { id: "rosca-martelo", name: "Rosca martelo", group: "biceps", equipment: "halteres" },
  { id: "rosca-scott", name: "Rosca scott", group: "biceps", equipment: "barra" },

  // Tríceps
  { id: "triceps-corda", name: "Tríceps corda", group: "triceps", equipment: "cabo" },
  { id: "triceps-frances", name: "Tríceps francês", group: "triceps", equipment: "halteres" },
  { id: "triceps-testa", name: "Tríceps testa", group: "triceps", equipment: "barra" },
  { id: "mergulho", name: "Mergulho no banco", group: "triceps", equipment: "peso corporal" },

  // Quadríceps
  { id: "agachamento-livre", name: "Agachamento livre", group: "quadriceps", equipment: "barra" },
  { id: "leg-press", name: "Leg press 45°", group: "quadriceps", equipment: "máquina" },
  { id: "cadeira-extensora", name: "Cadeira extensora", group: "quadriceps", equipment: "máquina" },
  { id: "hack", name: "Hack machine", group: "quadriceps", equipment: "máquina" },
  { id: "avanco", name: "Avanço com halteres", group: "quadriceps", equipment: "halteres" },

  // Posterior
  { id: "stiff", name: "Stiff", group: "posterior", equipment: "barra" },
  { id: "mesa-flexora", name: "Mesa flexora", group: "posterior", equipment: "máquina" },
  { id: "cadeira-flexora", name: "Cadeira flexora", group: "posterior", equipment: "máquina" },

  // Glúteos
  { id: "elevacao-pelvica", name: "Elevação pélvica", group: "gluteos", equipment: "barra" },
  { id: "cadeira-abdutora", name: "Cadeira abdutora", group: "gluteos", equipment: "máquina" },
  { id: "coice-cabo", name: "Coice no cabo", group: "gluteos", equipment: "cabo" },

  // Panturrilha
  { id: "panturrilha-em-pe", name: "Panturrilha em pé", group: "panturrilha", equipment: "máquina" },
  { id: "panturrilha-sentado", name: "Panturrilha sentado", group: "panturrilha", equipment: "máquina" },

  // Abdômen
  { id: "abdominal-supra", name: "Abdominal supra", group: "abdomen", equipment: "peso corporal" },
  { id: "prancha", name: "Prancha", group: "abdomen", equipment: "peso corporal" },
  { id: "abdominal-cabo", name: "Abdominal no cabo", group: "abdomen", equipment: "cabo" },
];

export const GROUP_LABELS: Record<MuscleGroup, string> = {
  peito: "Peito",
  costas: "Costas",
  ombros: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  quadriceps: "Quadríceps",
  posterior: "Posterior",
  gluteos: "Glúteos",
  panturrilha: "Panturrilha",
  abdomen: "Abdômen",
};

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

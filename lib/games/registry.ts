import type { ComponentType } from "react";

export type GameType = "quiz" | "match_up" | "whack_a_mole" | "spin_wheel";

export interface GameMeta {
  label: string;
  editorRoute: string;
  PlayerComponent: ComponentType<{ activityId: string; content: unknown }> | null;
}

// Lazy-load player components to keep the registry tree-shakeable.
// Editors are accessed via routes, not through this registry.
export const GAME_REGISTRY: Record<GameType, GameMeta> = {
  quiz: {
    label: "Quiz",
    editorRoute: "/activities/new/quiz",
    PlayerComponent: null, // resolved dynamically in play/[slug]/page.tsx
  },
  match_up: {
    label: "Match Up",
    editorRoute: "/activities/new/match-up",
    PlayerComponent: null,
  },
  whack_a_mole: {
    label: "Whack-a-mole",
    editorRoute: "/activities/new/whack-a-mole",
    PlayerComponent: null,
  },
  spin_wheel: {
    label: "Spin the Wheel",
    editorRoute: "/activities/new/spin-wheel",
    PlayerComponent: null,
  },
};

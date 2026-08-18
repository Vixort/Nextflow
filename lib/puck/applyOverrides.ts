// Backward-compatible barrel: the split-engine implementation moved to
// lib/puck/textSplit.ts (Puck engine v2 — layout/text separation).
export {
  getEditableFields,
  applyComponentOverrides as applyTextOverrides,
  buildTemplateTextInventory as buildTemplateInventory,
  sanitizeOverrideText,
} from './textSplit'

// Kept for existing imports; new code should use textSplit directly.
export type { PuckTextsByPage, LayoutProject, SplitProjectResult } from './textSplit'
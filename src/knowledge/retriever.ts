/**
 * Retrieval — see `plan.md` §6. The corpus (~20k curated tokens) fits Sonnet's context window
 * many times over, so there is nothing to select and therefore nothing to mis-select:
 * `InMemoryRetriever` returns every module, every turn. This interface is the seam a future
 * `PgVectorRetriever` would implement instead, without `src/chat/` noticing the swap.
 */

import type { KnowledgeModule } from "./types";
import { allModules } from "./modules";

export interface KnowledgeRetriever {
  retrieve(): KnowledgeModule[];
}

export class InMemoryRetriever implements KnowledgeRetriever {
  retrieve(): KnowledgeModule[] {
    return allModules;
  }
}

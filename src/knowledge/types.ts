/**
 * The knowledge contract — see `plan.md` §4.
 *
 * Everything the bot may say about Cadre AI is a `KnowledgeModule`; everything it must decline is
 * an `UnknownFact`. Both are first-class data of the same shape-class, which is the point of §2:
 * a refusal is a registered fact with a route, not an else-branch.
 *
 * Curators (`.claude/agents/knowledge-curator.md`) read this file and never edit it.
 */

/**
 * Subject a module covers. One member per section of cadreai.com the bot answers from.
 *
 * Extended only in the serial integration pass (Phase 2b), from the curator reports — a curator
 * that needs a member this union lacks reports it rather than adding it.
 */
export type Topic =
  | "services"
  | "industries"
  | "departments"
  | "maturity-index"
  | "contact-faq"
  | "escalation"
  | "case-studies"
  | "company"
  | "portal";

/** One curated fact the bot may state, and the page it traces back to. */
export type KnowledgeModule = {
  /** kebab-case, stable, unique across the whole knowledge base — not just its own section. */
  id: string;
  topic: Topic;
  /** Plain prose the model can quote from. Every claim in it traces to `source`. */
  content: string;
  /** The cadreai.com URL this was curated from — the `url` of its `knowledge-source` entry. */
  source: string;
  /**
   * `published` — the page states it outright, so the bot may quote it.
   * `derived` — assembled from several statements on the same page, so the bot attributes it to
   * the page rather than quoting. When it is between the two, it is `derived`.
   * `buildSystemPrompt` is what consumes this.
   */
  provenance: "published" | "derived";
  /**
   * sha256 of the source page's cleaned extract, copied verbatim from
   * `knowledge-source/manifest.json` at curation time. Never computed by hand: the bytes a module
   * was written from have to be the bytes a later drift job re-hashes.
   */
  sourceHash: string;
};

/**
 * One question Cadre has not published an answer to. The bot declines it and routes it — the
 * decline is deliberate because the gap is registered, rather than accidental because the model
 * had nothing to say.
 */
export type UnknownFact = {
  /** kebab-case, stable, unique across the registry. */
  id: string;
  /** What a user would actually ask. */
  question: string;
  /** Why it isn't knowable from the site — confirmed against the source, not assumed. */
  reason: string;
  /** Where the question goes instead: a strategist for sales, support for existing clients. */
  route: "strategist" | "support";
};

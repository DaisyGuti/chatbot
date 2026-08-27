/**
 * The first thing a visitor sees, before any turn exists. `ux-curator`'s brief §1.4: draw the
 * prompts from the six scenarios in `docs/requirements.md`, ground each in an actual knowledge
 * module, and phrase them as questions — a question asserts nothing, so it carries no fact that
 * needs a `source`.
 *
 * Every prompt below traces to a module registered in `src/knowledge/modules/index.ts`:
 *  - services + industries overview + private-equity page  -> "what Cadre does" / "which industries"
 *  - `contact-no-booking-calendar` + `escalation-contact`   -> "book a call with a strategist"
 *  - `strategy-maturity-index-pillars` + the contact FAQ    -> "the AI Maturity Index"
 *  - `strategy-llm-selection-data-security`                 -> "LLM selection and data security"
 */

type Props = {
  onPick: (prompt: string) => void;
  disabled: boolean;
};

const PROMPTS = [
  "What does Cadre AI do, and do you work with private equity firms?",
  "How do I book a call with an AI strategist?",
  "What is the AI Maturity Index, and how do I get scored?",
  "What's Cadre's approach to LLM selection and data security?",
] as const;

export function EmptyState({ onPick, disabled }: Props) {
  return (
    <div className="empty-state">
      <p>Try one of these, or type your own question below.</p>
      <ul className="prompt-list">
        {PROMPTS.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              className="prompt-chip"
              onClick={() => onPick(prompt)}
              disabled={disabled}
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

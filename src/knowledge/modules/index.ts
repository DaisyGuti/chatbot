/**
 * The barrel — every module the bot can speak from. See `plan.md` §10: an unregistered module is
 * invisible to retrieval and no test catches it, which is why registration happens once, here,
 * in the serial integration step rather than inside a curator.
 */

import type { KnowledgeModule } from "../types";
import { servicesModules } from "./services";
import { industriesModules } from "./industries";
import { departmentsModules } from "./departments";
import { strategyModules } from "./strategy";
import { contactModules } from "./contact";

export const allModules: KnowledgeModule[] = [
  ...servicesModules,
  ...industriesModules,
  ...departmentsModules,
  ...strategyModules,
  ...contactModules,
];

export { PucrsClient } from "./client";

// Load client plugins
import "./plugins/hours-grid.plugin";
import "./plugins/grade-grid.plugin";
import "./plugins/bill.plugin";

// Export parser types
export * from "./parsers/bill.parser";
export * from "./parsers/grade-grid.parser";
export * from "./parsers/hours-grid.parser";

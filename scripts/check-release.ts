import { listTodos } from "../src/content/index";

const todos = listTodos();
const urlTodos = todos.filter((t) => t.isUrl);
const factTodos = todos.filter((t) => !t.isUrl);

console.log(`Petalnode Release Check — ${todos.length} TODO item(s) remaining.\n`);

if (urlTodos.length > 0) {
  console.log(`Blocking URL TODOs (${urlTodos.length}):`);
  for (const t of urlTodos) {
    console.log(`  - ${t.path}: "${t.value}"`);
  }
  console.log("");
}

if (factTodos.length > 0) {
  console.log(`Fact / Copy TODOs (${factTodos.length}):`);
  for (const t of factTodos) {
    console.log(`  - ${t.path}: "${t.value}"`);
  }
  console.log("");
}

if (urlTodos.length > 0) {
  console.error(
    `Release check FAILED: ${urlTodos.length} URL value(s) are still TODO. Fill them in src/content/index.ts before deploying.`,
  );
  process.exit(1);
}

console.log("Release check PASSED: all required URLs are populated.");

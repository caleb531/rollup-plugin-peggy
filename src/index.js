import { buildParser } from "pegjs";
import { createFilter } from "rollup-pluginutils";

export default (options = {}) => ({
  transform(code, id) {
    const filter = createFilter(options.include || "*.pegjs", options.exclude);
    return filter(id) ? { code: buildParser(code, { output: "source" }), map: { mappings: "" } } : null;
  }
})

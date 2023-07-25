import { defineConfig } from "cypress";
import cypressJsonResults from "cypress-json-results";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      cypressJsonResults({
        on,
        filename: "results.json",
      });
    },
  },
});

import { defineConfig } from "cypress";
import cypressJsonResults from "cypress-json-results";
export default defineConfig({
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      cypressJsonResults({
        on,
        filename: "results.json",
      });
    },
  },
});

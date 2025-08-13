import type { PageServerLoad } from "./$types";

import questions from "$lib/assets/questions.json";

export const load: PageServerLoad = async () => {
  return {
    questions
  }
};

// A journey: a person’s path through the running copy of this app, walked by CI on every
// session’s copy and photographed at each step. Add yours beside it, one file per journey.
export default {
  name: 'The home page opens',
  steps: [
    {
      title: 'Open the home page',
      run: async ({ page, url }) => {
        const answer = await page.goto(url('/'));
        if (!answer || answer.status() >= 400) throw new Error(`the home page answered ${answer ? answer.status() : 'nothing'}`);
      },
    },
  ],
};

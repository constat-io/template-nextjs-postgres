// CI opens the design system page on each session’s running copy and photographs it: the picture of
// the app's look that DoneMark keeps beside each version of lib/design-system.ts.
export default {
  name: 'The design system page opens',
  steps: [
    {
      title: 'Open the design system page',
      run: async ({ page, url, see }) => {
        const answer = await page.goto(url('/design-system'));
        if (!answer || answer.status() >= 400) throw new Error(`the design system page answered ${answer ? answer.status() : 'nothing'}`);
        await see('Design system');
      },
    },
  ],
};

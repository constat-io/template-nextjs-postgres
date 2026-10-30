<!-- constat:template id=agents-md version=81 sha256=e1587e25033f891ef875810b309f7ce377aa2e805f385be5bdefb4a04c64ec32 -->
# Working in this repository

DoneMark checks the work done here. A person approves the "done when" lines of each change, an agent builds it,
this repository's CI runs a check for each line, and a person signs what ships.

## Checks

- Every "done when" line has a check that can fail.
- Name each check after the criterion it proves, word for word; a check named otherwise proves nothing on the record until a judge pairs it.
- Run the checks you write, and the tests that cover the code you change. CI runs the whole suite; what it runs
  on your last commit is what DoneMark reads.
- How CI runs the tests is in `.github/workflows/constat-ci.yml`: run the same commands to check your work.

## Leave alone

- Never create, change or delete anything under `.github/workflows/`: the CI that checks your work is a person's to change.
- The files DoneMark wrote and reads: `.github/scripts/constat-*`, `.constat/requirements/`,
  `.constat/security-rules/` and `.constat/template.md`.
- Secrets: never in the code or the repository.

This file is yours to change. Once you change it, DoneMark stops updating it.

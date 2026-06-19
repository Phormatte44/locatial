# Repository Setup

## Recommended repository

Create a dedicated private GitHub repository:

`locatial-corpus`

Do not bury this corpus inside the application code repository initially. Keeping it separate makes authority and change review clearer.

Later, the product repositories can reference this corpus as:

- a Git submodule;
- a copied `docs/locatial-corpus/` directory maintained by automation;
- a linked repository in the AI tool;
- a documentation package consumed during planning.

## Recommended workflow

1. Create the private GitHub repository.
2. Upload the contents of this package to the repository root.
3. Commit with a message such as:
   `Initialize Locatial brand and place-intelligence corpus`
4. Connect Claude or Claude Code to the repository.
5. Begin every substantial task by instructing Claude to read:
   - `00_START_HERE.md`
   - `CLAUDE.md`
   - `CORPUS_MAP.md`
   - the relevant source files.
6. Require Claude to update the repository files when decisions change.
7. Review and commit material changes through pull requests where possible.

## Human versus Claude responsibility

### You should do once

- create the repository;
- upload and commit the initial corpus;
- control access;
- decide which branches and pull requests are accepted.

### Claude can do after connection

- read the corpus;
- propose edits;
- add new documents in the correct folders;
- update canonical documents;
- update the changelog;
- create commits or pull requests when the connected environment supports write access.

Do not rely on Claude's chat memory as the corpus. The repository is the memory.

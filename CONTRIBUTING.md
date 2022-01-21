## Contributing

First off, thank you for considering contributing to User Management. It's people
like you that make it such a great tool.

### Where do I go from here?

If you've noticed a bug or have a feature request, [make one][new issue]! It's
generally best if you get confirmation of your bug or approval for your feature
request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then [fork Active Admin] and create
a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-unit-test
```

### Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help!


### Make a Pull Request

At this point, you should switch back to your main branch and make sure it's
up to date with User Management's main branch:

```sh
git remote add upstream git@github.com:dejaniskra/user-management.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout 325-add-unit-test
git rebase main
git push --set-upstream origin 325-add-unit-test
```

Finally, go to GitHub and [make a Pull Request][] :D


### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good][git rebasing]
[resources][interactive rebase] but here's the suggested workflow:

```sh
git checkout 325-add-unit-test
git pull --rebase upstream main
git push --force-with-lease 325-add-unit-test
```

### Merging a PR (maintainers only)

A PR can only be merged into main by a maintainer if:

* It is passing CI.
* It has been approved by at least two maintainers. If it was a maintainer who
  opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current main.

Any maintainer is allowed to merge a PR if all of these conditions are
met.
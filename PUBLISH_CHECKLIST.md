# Publishing to NPM Checklist

## All cases:

- [ ] Merge everything down to the master branch
- [ ] Take a look at unit tests passing
- [ ] run `./scripts/versionBump.sh patch|minor|major|version` to bump the version number and get the repo tagged correctly.

## Choice A: GH Actions

- [ ] Run 'git push && git push --tags' to push the new tag to the repo. 
- [ ] GH Actions takes care of the rest


## Choice B: Manual

- [ ] run `npm publish` to publish the package to NPM

## Afterwards:

- [ ] Update the version on the client side to the new version number with `yarn up @regolithco/common@x.x.x`
- [ ] Update the version on the server side to the new version number with `yarn up @regolithco/common@x.x.x`

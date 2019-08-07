# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2019-08-07
### Fixed
- Fixed bad chain error when a promise resolves to null.

## [1.1.1] - 2019-08-06
### Fixed
- Concurrency not resolving for map.

## [1.1.0] - 2019-08-02
### Changed
- Changed the second parameter to chain functions to be an object.

### Added
- Added `$assign` to chain functions, so that values can be stored intermediately outside of the accumulator.

## [1.0.2] - 2019-08-01
### Fixed
- Fixed the built modules not being published to npm.
- Fixed the typings not being published to npm.

## [1.0.1] - 2019-08-01
### Added
- Added repository to package.json

## 1.0.0 - 2019-08-01
### Added
- Added toPromise, map and chain utilities.

[Unreleased]: https://github.com/leedavidcs/awaitless/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/leedavidcs/awaitless/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/leedavidcs/awaitless/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.0...v1.0.1

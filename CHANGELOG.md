# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.1] - 2019-09-03
### Fixed
- Fixed some table-of-contents links not working.

### Added
- Added types for TypeScript.

## [1.6.0] - 2019-08-29
### Fixed
- Fixed table-of-contents to better work with npm and github.

### Added
- Added filter.

## [1.5.0] - 2019-08-29
### Added
- Added table-of-contents to README.
- Added typescript code-fencing to README.
- Added reduce.

## [1.4.1] - 2019-08-28
### Added
- Updated README with shiny new badges!
- Added more tests.
- Added CI and sonarcloud quality analysis.

## [1.4.0] - 2019-08-27
### Added
- Added doWhilst.

## [1.3.1] - 2019-08-27
### Fixed
- Fixed missing whilst function.

## [1.3.0] - 2019-08-27
### Added
- Added whilst.

### Fixed
- Fixed awaitless missing chain on the default export.

## [1.2.0] - 2019-08-23
### Added
- Added forEach.

### Changed
- Changed map to also have an index as a second parameter to the map function.

## [1.1.3] - 2019-08-08
### Fixed
- Fixed chain not halting execution when  has been resolved in a Promise.

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

[Unreleased]: https://github.com/leedavidcs/awaitless/compare/v1.6.1...HEAD
[1.6.1]: https://github.com/leedavidcs/awaitless/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/leedavidcs/awaitless/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/leedavidcs/awaitless/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/leedavidcs/awaitless/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/leedavidcs/awaitless/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/leedavidcs/awaitless/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/leedavidcs/awaitless/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/leedavidcs/awaitless/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/leedavidcs/awaitless/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/leedavidcs/awaitless/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/leedavidcs/awaitless/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dlee-onfleet/awaitless/compare/v1.0.0...v1.0.1

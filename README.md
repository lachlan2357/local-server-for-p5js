# Local Server for `p5.js` Projects

Downloads and serves p5.js projects hosted on `editor.p5js.org`.

## Overview

This project is a local client which can download and cache any project hosted on `p5.js`. It uses the same API which `editor.p5js.org` uses to host projects in full-screen.

## Features

* Download any project hosted on `editor.p5js.org`
* Local caching of projects for when your device is offline.
* Pure fullscreen mode

## Notes

This project functions no differently to how the `p5.js` fullscreen view works in terms of requesting files. Once cached, each local request for a project will not fetch from `editor.p5.js` unless the cache is first deleted. Because of this, it places less strain on the `editor.p5.js` server than loading the fullscreen view.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for more information.

### Third-Party Library License Notices

The following third-party libraries are required, with their associated licenses:

| Name | NPM | License |
| - | - | - |
| ExpressJS | [express](https://www.npmjs.com/package/express) | MIT License
| SQLite | [sqlite](https://www.npmjs.com/package/sqlite) | MIT License
| SQLite3 | [sqlite3](https://www.npmjs.com/package/sqlite3) | BSD 3-Clause License
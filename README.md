# deno_machine_id

[![tag](https://img.shields.io/github/release/justjavac/deno_machine_id)](https://github.com/justjavac/deno_machine_id/releases)
[![Build Status](https://github.com/justjavac/deno_machine_id/workflows/ci/badge.svg?branch=master)](https://github.com/justjavac/deno_machine_id/actions)
[![license](https://img.shields.io/github/license/justjavac/deno_machine_id)](https://github.com/justjavac/deno_machine_id/blob/master/LICENSE)
[![](https://img.shields.io/badge/deno-v1.3-green.svg)](https://github.com/denoland/deno)

Unique machine (desktop) id (no admin privileges required).

## Usage

```ts
import machineId from "https://deno.land/x/deno_machine_id/mod.ts";

let id = await machineId();
// c24b0fe51856497eebb6a2bfcd120247aac0d6334d670bb92e09a00ce8169365

let id = machineId(true)
// 98912984-c4e9-5ceb-8000-03882a0485e4
```

Requires `allow-run` permission.

## Thanks

Heavily inspired by [automation-stack/node-machine-id](https://github.com/automation-stack/node-machine-id).

## License

[deno_machine_id](https://github.com/justjavac/deno_machine_id) is released under the MIT License. See the bundled [LICENSE](./LICENSE) file for details.

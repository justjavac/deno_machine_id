import { createHash } from "https://deno.land/std/hash/mod.ts";

export default async function machineId(original = false): Promise<string> {
  let guid: string;

  switch (Deno.build.os) {
    case "linux": {
      var output: string = "";
      try {
        output = await exec(
          ["cat", "/var/lib/dbus/machine-id", "/etc/machine-id"],
        );
      } catch {
        output = await exec(["hostname"]);
      }
      guid = output
        .substr(0, output.indexOf("\n"))
        .replace(/\r+|\n+|\s+/ig, "")
        .toLowerCase();
      break;
    }

    case "darwin": {
      const output = await exec(
        ["ioreg", "-rd1", "-c", "IOPlatformExpertDevice"],
      );
      guid = output.split("IOPlatformUUID")[1]
        .split("\n")[0].replace(/\=|\s+|\"/ig, "")
        .toLowerCase();
      break;
    }

    case "windows": {
      const output = await exec(
        [
          "REG",
          "QUERY",
          "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography",
          "/v",
          "MachineGuid",
        ],
      );
      guid = output
        .split("REG_SZ")[1]
        .replace(/\r+|\n+|\s+/ig, "")
        .toLowerCase();
      break;
    }
  }

  if (original) {
    return guid;
  }

  return hash(guid);
}

async function exec(cmd: string[]): Promise<string> {
  const p = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await p.status();

  if (code === 0) {
    const rawOutput = await p.output();
    const outputString = new TextDecoder().decode(rawOutput);
    return outputString;
  } else {
    const rawError = await p.stderrOutput();
    const errorString = new TextDecoder().decode(rawError);
    throw new Error(errorString);
  }
}

function hash(guid: string): string {
  return createHash("sha256").update(guid).toString("hex");
}

console.log(await machineId());

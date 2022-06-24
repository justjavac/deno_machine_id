export default async function machineId(original = false): Promise<string> {
  let guid: string;

  switch (Deno.build.os) {
    case "linux": {
      let output = "";
      try {
        output = await exec([
          "cat",
          "/var/lib/dbus/machine-id",
          "/etc/machine-id",
        ]);
      } catch {
        output = await exec(["hostname"]);
      }
      guid = output
        .substring(0, output.indexOf("\n"))
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
      break;
    }

    case "darwin": {
      const output = await exec([
        "ioreg",
        "-rd1",
        "-c",
        "IOPlatformExpertDevice",
      ]);
      guid = output
        .split("IOPlatformUUID")[1]
        .split("\n")[0]
        .replace(/\=|\s+|\"/gi, "")
        .toLowerCase();
      break;
    }

    case "windows": {
      const output = await exec([
        "REG",
        "QUERY",
        "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography",
        "/v",
        "MachineGuid",
      ]);
      guid = output
        .split("REG_SZ")[1]
        .replace(/\r+|\n+|\s+/gi, "")
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
  let p: Deno.Process;

  try {
    p = Deno.run({
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
  } finally {
    p!.stderr?.close();
    p!.close();
  }
}

async function hash(guid: string): Promise<string> {
  const data = new TextEncoder().encode(guid);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

if (import.meta.main) {
  console.log(await machineId());
}

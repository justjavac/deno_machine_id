import { assertNotEquals } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import machineId from "./mod.ts";

const { test } = Deno;

test({
  name: "machineId",
  fn: async () => {
    const id = await machineId();
    assertNotEquals(id, "");
  },
});

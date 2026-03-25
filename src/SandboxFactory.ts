import { Context, Effect, Layer } from "effect";
import { randomUUID } from "node:crypto";
import { DockerSandbox } from "./DockerSandbox.js";
import { startContainer, removeContainer } from "./DockerLifecycle.js";
import type { DockerError } from "./errors.js";
import { Sandbox } from "./Sandbox.js";

export class SandboxConfig extends Context.Tag("SandboxConfig")<
  SandboxConfig,
  {
    readonly imageName: string;
    readonly env: Record<string, string>;
  }
>() {}

export class SandboxFactory extends Context.Tag("SandboxFactory")<
  SandboxFactory,
  {
    readonly withSandbox: <A, E, R>(
      effect: Effect.Effect<A, E, R | Sandbox>,
    ) => Effect.Effect<A, E | DockerError, Exclude<R, Sandbox>>;
  }
>() {}

export const DockerSandboxFactory = {
  layer: Layer.effect(
    SandboxFactory,
    Effect.gen(function* () {
      const { imageName, env } = yield* SandboxConfig;
      return {
        withSandbox: <A, E, R>(
          effect: Effect.Effect<A, E, R | Sandbox>,
        ): Effect.Effect<A, E | DockerError, Exclude<R, Sandbox>> => {
          const containerName = `sandcastle-${randomUUID()}`;
          return Effect.acquireUseRelease(
            startContainer(containerName, imageName, env),
            () =>
              effect.pipe(
                Effect.provide(DockerSandbox.layer(containerName)),
              ) as Effect.Effect<A, E | DockerError, Exclude<R, Sandbox>>,
            () => removeContainer(containerName).pipe(Effect.orDie),
          );
        },
      };
    }),
  ),
};

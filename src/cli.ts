import { Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { readConfig } from "./Config.js";
import { DockerSandbox } from "./DockerSandbox.js";
import { FilesystemSandbox } from "./FilesystemSandbox.js";
import {
  buildImage,
  cleanupContainer,
  startContainer,
} from "./DockerLifecycle.js";
import { syncIn, syncOut } from "./SyncService.js";

// --- Shared options ---

const sandboxDirOption = Options.directory("sandbox-dir").pipe(
  Options.withDescription("Path to the sandbox directory"),
);

const containerOption = Options.text("container").pipe(
  Options.withDescription("Docker container name"),
);

const containerOptional = Options.text("container").pipe(
  Options.withDescription("Docker container name (use Docker layer)"),
  Options.optional,
);

const baseHeadOption = Options.text("base-head").pipe(
  Options.withDescription(
    "The HEAD commit SHA from sync-in (used to determine new commits)",
  ),
);

// --- Setup command ---

const oauthTokenOption = Options.text("oauth-token").pipe(
  Options.withDescription("Claude Code OAuth token"),
);

const ghTokenOption = Options.text("gh-token").pipe(
  Options.withDescription("GitHub personal access token"),
);

const imageNameOption = Options.text("image-name").pipe(
  Options.withDescription("Docker image name"),
  Options.withDefault("sandcastle:local"),
);

const setupCommand = Command.make(
  "setup",
  {
    container: containerOption,
    oauthToken: oauthTokenOption,
    ghToken: ghTokenOption,
    imageName: imageNameOption,
  },
  ({ container, oauthToken, ghToken, imageName }) =>
    Effect.gen(function* () {
      yield* Console.log(`Building Docker image '${imageName}'...`);
      yield* buildImage(imageName);

      yield* Console.log(`Starting container '${container}'...`);
      yield* startContainer(container, imageName, oauthToken, ghToken);

      yield* Console.log(
        `Setup complete! Container '${container}' is running.`,
      );
    }),
);

// --- Cleanup command ---

const cleanupCommand = Command.make(
  "cleanup",
  {
    container: containerOption,
    imageName: imageNameOption,
  },
  ({ container, imageName }) =>
    Effect.gen(function* () {
      yield* Console.log(`Cleaning up container '${container}'...`);
      yield* cleanupContainer(container, imageName);
      yield* Console.log("Cleanup complete.");
    }),
);

// --- Sync-in command ---

const SANDBOX_REPOS_DIR = "/home/agent/repos";

const syncInCommand = Command.make(
  "sync-in",
  { sandboxDir: sandboxDirOption, container: containerOptional },
  ({ sandboxDir, container }) =>
    Effect.gen(function* () {
      const hostRepoDir = process.cwd();
      const repoName = hostRepoDir.split("/").pop()!;

      const useDocker = container._tag === "Some";
      const sandboxRepoDir = useDocker
        ? `${SANDBOX_REPOS_DIR}/${repoName}`
        : `${sandboxDir}/repo`;

      yield* Console.log(`Syncing ${hostRepoDir} into ${sandboxRepoDir}...`);

      const config = yield* readConfig(hostRepoDir);
      const layer = useDocker
        ? DockerSandbox.layer(container.value)
        : FilesystemSandbox.layer(sandboxDir);

      const { branch } = yield* syncIn(
        hostRepoDir,
        sandboxRepoDir,
        config,
      ).pipe(Effect.provide(layer));

      yield* Console.log(`Sync-in complete. Branch: ${branch}`);
    }),
);

// --- Sync-out command ---

const syncOutCommand = Command.make(
  "sync-out",
  {
    sandboxDir: sandboxDirOption,
    baseHead: baseHeadOption,
    container: containerOptional,
  },
  ({ sandboxDir, baseHead, container }) =>
    Effect.gen(function* () {
      const hostRepoDir = process.cwd();
      const repoName = hostRepoDir.split("/").pop()!;

      const useDocker = container._tag === "Some";
      const sandboxRepoDir = useDocker
        ? `${SANDBOX_REPOS_DIR}/${repoName}`
        : `${sandboxDir}/repo`;

      yield* Console.log(
        `Syncing changes from ${sandboxRepoDir} back to ${hostRepoDir}...`,
      );

      const layer = useDocker
        ? DockerSandbox.layer(container.value)
        : FilesystemSandbox.layer(sandboxDir);

      yield* syncOut(hostRepoDir, sandboxRepoDir, baseHead).pipe(
        Effect.provide(layer),
      );

      yield* Console.log("Sync-out complete.");
    }),
);

// --- Root command ---

const rootCommand = Command.make("sandcastle", {}, () =>
  Effect.gen(function* () {
    yield* Console.log("Sandcastle v0.0.1");
    yield* Console.log("Use --help to see available commands.");
  }),
);

export const sandcastle = rootCommand.pipe(
  Command.withSubcommands([
    syncInCommand,
    syncOutCommand,
    setupCommand,
    cleanupCommand,
  ]),
);

export const cli = Command.run(sandcastle, {
  name: "sandcastle",
  version: "0.0.1",
});

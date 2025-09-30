import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"scope-enum": [
			2,
			"always",
			[
				"@osmynt-core/engine",
				"@osmynt-core/osmynt",
				"@osmynt-core/webapp",
				"osmynt-core",
				"@osmynt-core/api",
				"@osmynt-core/database",
				"@osmynt-core/library",
			],
		],
		"scope-empty": [2, "never"],
		"type-enum": [
			2,
			"always",
			[
				"release",
				"build",
				"chore",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test",
				"wip",
				"hotfix",
			],
		],
	},
};

export default Configuration;

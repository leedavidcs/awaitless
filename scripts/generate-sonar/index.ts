import { writeFile } from "fs-extra";
import { Environment, FileSystemLoader } from "nunjucks";
import ReadPkg, { NormalizedPackageJson } from "read-pkg";

const testInclusionPatterns: string[] = ["**/*test.ts*", "**/*test/index.ts*"];
const exclusionPatterns: string[] = [
	".jest/**/*",
	"coverage/**/*",
	"dist/**/*",
	"node_modules/**/*",
	"scripts/**/*",
	"test-reports/**/*",
	"**/*test.ts*",
	"**/*test/index.ts*",
	"**/*.js*"
];

/**
 * @function main
 * @returns { never }
 * @description Generates a sonar-project.properties file for SonarCloud static analysis
 */
const main = async (): Promise<never> => {
	const pkg: NormalizedPackageJson = await ReadPkg();
	const environment: Environment = new Environment(
		new FileSystemLoader("scripts/generate-sonar")
	);

	const inclusions: string = testInclusionPatterns.join(",");
	const exclusions: string = exclusionPatterns.join(",");

	const fileContents: string = environment.render("sonar-project.njk", {
		exclusions,
		inclusions,
		pkg
	});

	await writeFile("sonar-project.properties", fileContents);

	return process.exit(0);
};

main();

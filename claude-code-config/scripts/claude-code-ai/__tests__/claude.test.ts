import { describe, expect, it } from "bun:test";
import { generateTextCC, type Model } from "../claude";

const models: Model[] = ["haiku", "sonnet", "opus"];

describe("generateTextCC", () => {
	for (const model of models) {
		it(`should generate text with ${model}`, async () => {
			const result = await generateTextCC({
				prompt: "Hey",
				model,
			});

			expect(result).toBeDefined();
			expect(typeof result).toBe("string");
			expect(result.length).toBeGreaterThan(0);
		}, 30000);
	}
});

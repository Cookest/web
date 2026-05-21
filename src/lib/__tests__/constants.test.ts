import {
  CUISINES,
  DIFFICULTIES,
  DIETARY_OPTIONS,
  DIFFICULTY_COLORS,
  HEALTH_GOALS,
  SKILL_LEVELS,
} from "../constants";

describe("CUISINES", () => {
  it("is a non-empty array", () => {
    expect(CUISINES.length).toBeGreaterThan(0);
  });

  it("contains expected cuisine values", () => {
    expect(CUISINES).toContain("italian");
    expect(CUISINES).toContain("asian");
    expect(CUISINES).toContain("mediterranean");
    expect(CUISINES).toContain("mexican");
    expect(CUISINES).toContain("japanese");
  });
});

describe("DIFFICULTIES", () => {
  it("has easy, medium, hard", () => {
    expect(DIFFICULTIES).toEqual(["easy", "medium", "hard"]);
  });
});

describe("DIETARY_OPTIONS", () => {
  it("has vegetarian, vegan, and other options", () => {
    const values = DIETARY_OPTIONS.map((o) => o.value);
    expect(values).toContain("vegetarian");
    expect(values).toContain("vegan");
    expect(values).toContain("gluten_free");
    expect(values).toContain("dairy_free");
    expect(values).toContain("keto");
    expect(values).toContain("paleo");
  });

  it("each option has a value and label", () => {
    for (const option of DIETARY_OPTIONS) {
      expect(option.value).toBeDefined();
      expect(option.label).toBeDefined();
      expect(typeof option.value).toBe("string");
      expect(typeof option.label).toBe("string");
    }
  });
});

describe("DIFFICULTY_COLORS", () => {
  it("maps easy to green classes", () => {
    expect(DIFFICULTY_COLORS.easy).toContain("green");
  });

  it("maps medium to amber classes", () => {
    expect(DIFFICULTY_COLORS.medium).toContain("amber");
  });

  it("maps hard to red classes", () => {
    expect(DIFFICULTY_COLORS.hard).toContain("red");
  });

  it("has entries for all difficulties", () => {
    for (const diff of DIFFICULTIES) {
      expect(DIFFICULTY_COLORS[diff]).toBeDefined();
    }
  });
});

describe("HEALTH_GOALS", () => {
  it("has expected values", () => {
    const values = HEALTH_GOALS.map((g) => g.value);
    expect(values).toContain("weight_loss");
    expect(values).toContain("muscle_gain");
    expect(values).toContain("heart_health");
    expect(values).toContain("energy");
    expect(values).toContain("balanced");
  });

  it("each goal has a value and label", () => {
    for (const goal of HEALTH_GOALS) {
      expect(goal.value).toBeDefined();
      expect(goal.label).toBeDefined();
    }
  });
});

describe("SKILL_LEVELS", () => {
  it("has beginner, intermediate, advanced", () => {
    const values = SKILL_LEVELS.map((s) => s.value);
    expect(values).toEqual(["beginner", "intermediate", "advanced"]);
  });

  it("each level has a value and label", () => {
    for (const level of SKILL_LEVELS) {
      expect(level.value).toBeDefined();
      expect(level.label).toBeDefined();
    }
  });
});

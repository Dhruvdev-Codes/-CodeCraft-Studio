import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeOutput, formatMs, formatDate, formatDateTime, cn } from "../src/lib/utils";
import { LANGUAGES, LANGUAGE_IDS, DEFAULT_STARTERS, LANGUAGES_ARRAY } from "../src/lib/executor";
import { SEED_COURSES } from "../src/lib/seed/courseData";
import { SEED_PROBLEMS } from "../src/lib/seed/problemData";

describe("Utility Functions", () => {
  it("normalizeOutput handles CRLF, trailing spaces, and blank lines", () => {
    assert.equal(normalizeOutput("hello \r\nworld  \r\n"), "hello\nworld");
    assert.equal(normalizeOutput("42\n"), "42");
    assert.equal(normalizeOutput(""), "");
    assert.equal(normalizeOutput("  abc   "), "  abc");
  });

  it("formatMs formats durations cleanly", () => {
    assert.equal(formatMs(50), "50ms");
    assert.equal(formatMs(999), "999ms");
    assert.equal(formatMs(1500), "1.50s");
    assert.equal(formatMs(2000), "2.00s");
  });

  it("cn merges tailwind classes conditionally", () => {
    assert.equal(cn("btn", false && "hidden", "btn-primary"), "btn btn-primary");
    assert.equal(cn("p-4", "p-2"), "p-2"); // tailwind-merge resolves conflicts
  });

  it("formatDate and formatDateTime produce valid strings", () => {
    const iso = "2026-09-12T12:00:00.000Z";
    assert.ok(formatDate(iso).length > 0);
    assert.ok(formatDateTime(iso).length > 0);
  });
});

describe("Language & Starter Configurations", () => {
  it("defines all supported programming languages", () => {
    const expectedLanguages = ["python", "javascript", "typescript", "cpp", "c", "java", "go"];
    for (const lang of expectedLanguages) {
      assert.ok(LANGUAGE_IDS.includes(lang as any), `Missing language: ${lang}`);
      assert.ok(LANGUAGES[lang as keyof typeof LANGUAGES], `Language config missing for ${lang}`);
      assert.ok(DEFAULT_STARTERS[lang as keyof typeof DEFAULT_STARTERS], `Starter code missing for ${lang}`);
      assert.ok(LANGUAGES[lang as keyof typeof LANGUAGES].piston, `Piston name missing for ${lang}`);
      assert.ok(LANGUAGES[lang as keyof typeof LANGUAGES].extension, `Extension missing for ${lang}`);
    }
  });

  it("LANGUAGES_ARRAY maps all language configs with id", () => {
    assert.equal(LANGUAGES_ARRAY.length, LANGUAGE_IDS.length);
    for (const item of LANGUAGES_ARRAY) {
      assert.ok(item.id);
      assert.ok(item.name);
      assert.ok(item.template);
    }
  });
});

describe("Course & Problem Seed Data Integrity", () => {
  it("all course seeds have valid slugs, non-empty lessons, and starter code", () => {
    assert.ok(SEED_COURSES.length >= 2, "Should have at least 2 default courses");
    for (const course of SEED_COURSES) {
      assert.ok(course.slug && /^[a-z0-9-]+$/.test(course.slug), `Invalid slug in course ${course.title}`);
      assert.ok(course.title, "Course title is required");
      assert.ok(course.description, "Course description is required");
      assert.ok(course.lessons && course.lessons.length > 0, `Course ${course.title} must have lessons`);

      for (const lesson of course.lessons) {
        assert.ok(lesson.slug && /^[a-z0-9-]+$/.test(lesson.slug), `Invalid lesson slug in ${course.title}`);
        assert.ok(lesson.title, `Lesson title missing in ${course.title}`);
        assert.ok(lesson.content, `Lesson content missing in ${lesson.title}`);
        assert.ok(lesson.code, `Lesson starter code missing in ${lesson.title}`);
      }
    }
  });

  it("all problem seeds have valid test cases, descriptions, and difficulty", () => {
    assert.ok(SEED_PROBLEMS.length >= 5, "Should have seeded algorithm problems");
    for (const problem of SEED_PROBLEMS) {
      assert.ok(problem.slug && /^[a-z0-9-]+$/.test(problem.slug), `Invalid problem slug: ${problem.slug}`);
      assert.ok(problem.title, `Problem title missing: ${problem.slug}`);
      assert.ok(problem.testCases && problem.testCases.length >= 2, `Problem ${problem.slug} must have >= 2 test cases`);

      const samples = problem.testCases.filter((tc) => !tc.hidden);
      assert.ok(samples.length >= 1, `Problem ${problem.slug} must have at least 1 public sample test case`);

      for (const tc of problem.testCases) {
  it("all course lessons have consecutive or increasing orders and valid durations", () => {
    for (const course of SEED_COURSES) {
      let lastOrder = 0;
      for (const lesson of course.lessons) {
        assert.ok(lesson.order > lastOrder, `Lesson order not increasing in ${course.title}`);
        lastOrder = lesson.order;
        assert.ok(lesson.duration.includes("min"), `Duration format missing 'min' in ${lesson.title}`);
      }
    }
  });

  it("problems have properly structured starterCode dictionary or empty object", () => {
    for (const problem of SEED_PROBLEMS) {
      assert.equal(typeof problem.starterCode, "object");
      assert.ok(Array.isArray(problem.languages));
      assert.ok(problem.languages.length > 0);
      assert.ok(problem.points > 0);
    }
  });

        assert.notEqual(tc.input, undefined, `Test case input undefined in ${problem.slug}`);
        assert.notEqual(tc.expectedOutput, undefined, `Test case expectedOutput undefined in ${problem.slug}`);
      }
    }
  });
});

// Seed data for the problem arena — test cases with public (sample) and
// hidden suites, plus per-language starter code maps.

export const SEED_PROBLEMS = [
  {
    title: "Hello, World!",
    slug: "hello-world",
    description: `## Welcome to the Arena

Your first mission: write a program that prints exactly:

\`Hello, World!\`

No input is provided. The judge compares your program's output against the
expected output — trailing whitespace and blank lines are ignored.`,
    difficulty: "Beginner",
    languages: ["python", "javascript", "java", "cpp", "c", "go"],
    points: 10,
    tags: ["basics", "io"],
    starterCode: {},
    testCases: [
      { input: "", expectedOutput: "Hello, World!", hidden: false },
      { input: "", expectedOutput: "Hello, World!", hidden: true },
    ],
  },
  {
    title: "Sum of Two Numbers",
    slug: "sum-of-two",
    description: `## Sum of Two Numbers

Read two integers \`a\` and \`b\` from **standard input** (space or newline
separated, single line) and print their sum.

### Example

\`\`\`text
Input:  3 5
Output: 8
\`\`\`

### Constraints

- \`-1000 ≤ a, b ≤ 1000\``,
    difficulty: "Beginner",
    languages: ["python", "javascript", "java", "cpp", "c", "go"],
    points: 20,
    tags: ["arithmetic", "io"],
    starterCode: {
      python: `import sys

def solve(a: int, b: int) -> int:
    # TODO: return the sum of a and b
    return 0

if __name__ == "__main__":
    data = sys.stdin.read().strip().split()
    if data:
        a, b = map(int, data[:2])
        print(solve(a, b))`,
      javascript: `function solve(a, b) {
  // TODO: return the sum of a and b
  return 0;
}

const data = require("fs").readFileSync(0, "utf-8").trim().split(/\\s+/);
if (data.length) {
  const [a, b] = data.map(Number);
  console.log(solve(a, b));
}`,
      java: `import java.util.*;

public class Main {
    public static int solve(int a, int b) {
        // TODO: return the sum of a and b
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(solve(a, b));
    }
}`,
    },
    testCases: [
      { input: "3 5\n", expectedOutput: "8", hidden: false },
      { input: "-7 12\n", expectedOutput: "5", hidden: true },
      { input: "100 250\n", expectedOutput: "350", hidden: true },
      { input: "0 0\n", expectedOutput: "0", hidden: true },
    ],
  },
{
    title: "FizzBuzz",
    slug: "fizzbuzz",
    description: `## FizzBuzz

Read a single integer \`n\`. Print a line for each number from \`1\` to \`n\`:

- **"Fizz"** if the number is divisible by 3,
- **"Buzz"** if divisible by 5,
- **"FizzBuzz"** if divisible by both 3 and 5,
- otherwise the number itself.

### Example

\`\`\`text
Input:  15
Output:
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`

### Constraints

- \`1 ≤ n ≤ 100\``,
    difficulty: "Intermediate",
    languages: ["python", "javascript", "java"],
    points: 30,
    tags: ["loops", "conditionals"],
    starterCode: {
      python: `import sys

def fizzbuzz(n: int) -> str:
    lines = []
    for i in range(1, n + 1):
        # TODO: append "Fizz", "Buzz", or "FizzBuzz"
        lines.append(str(i))
    return "\\n".join(lines)

if __name__ == "__main__":
    n = int(sys.stdin.read().strip())
    print(fizzbuzz(n))`,
      javascript: `function fizzbuzz(n) {
  const lines = [];
  for (let i = 1; i <= n; i++) {
    // TODO: append "Fizz", "Buzz", or "FizzBuzz"
    lines.push(String(i));
  }
  return lines.join("\\n");
}

const n = Number(require("fs").readFileSync(0, "utf-8").trim());
console.log(fizzbuzz(n));`,
      java: `import java.util.*;

public class Main {
    public static String fizzbuzz(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append("\\n");
            // TODO: append "Fizz", "Buzz", or "FizzBuzz" to sb
            sb.append(i);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fizzbuzz(n));
    }
}`,
    },
    testCases: [
      {
        input: "15\n",
        expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        hidden: false,
      },
      {
        input: "5\n",
        expectedOutput: "1\n2\nFizz\n4\nBuzz",
        hidden: true,
      },
      { input: "1\n", expectedOutput: "1", hidden: true },
      { input: "30\n", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz", hidden: true },
    ],
  },
  {
    title: "Nth Fibonacci",
    slug: "nth-fibonacci",
    description: `## Nth Fibonacci

Read an integer \`n\` and print the \`n\`-th Fibonacci number, where:

\`\`\`text
F(1) = 1
F(2) = 1
F(n) = F(n-1) + F(n-2)   for n > 2
\`\`\`

### Example

\`\`\`text
Input:  10
Output: 55
\`\`\`

### Constraints

- \`1 ≤ n ≤ 40\`

> 💡 **Hint:** a recursive solution that recomputes subtrees is far too slow.
> The hidden tests will hang a naive implementation — iterate instead.`,
    difficulty: "Intermediate",
    languages: ["python", "javascript", "cpp"],
    points: 40,
    tags: ["dynamic-programming", "memoization"],
    starterCode: {
      python: `import sys

def fib(n: int) -> int:
    # TODO: return the n-th Fibonacci number
    return 0

if __name__ == "__main__":
    n = int(sys.stdin.read().strip())
    print(fib(n))`,
      javascript: `function fib(n) {
  // TODO: return the n-th Fibonacci number
  return 0;
}

const n = Number(require("fs").readFileSync(0, "utf-8").trim());
console.log(fib(n));`,
      cpp: `#include <iostream>
using namespace std;

long long fib(int n) {
    // TODO: return the n-th Fibonacci number
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << fib(n) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "10\n", expectedOutput: "55", hidden: false },
      { input: "1\n", expectedOutput: "1", hidden: true },
      { input: "2\n", expectedOutput: "1", hidden: true },
      { input: "20\n", expectedOutput: "6765", hidden: true },
      { input: "40\n", expectedOutput: "102334155", hidden: true },
    ],
  },
  {
    title: "Palindrome Check",
    slug: "palindrome-check",
    description: `## Palindrome Check

Read a single word from standard input and print **\`true\`** if it reads the
same forwards and backwards, otherwise print **\`false\`** (lowercase).

### Examples

\`\`\`text
Input:  racecar
Output: true

Input:  hello
Output: false
\`\`\`

### Constraints

- The word contains only lowercase letters, length 1 <= len <= 10000`,
    difficulty: "Intermediate",
    languages: ["python", "javascript"],
    points: 30,
    tags: ["strings", "two-pointers"],
    starterCode: {
      python: `import sys

def is_palindrome(s: str) -> bool:
    # TODO: return True if s reads the same forwards and backwards
    return False

if __name__ == "__main__":
    s = sys.stdin.read().strip()
    print(str(is_palindrome(s)).lower())`,
      javascript: `function isPalindrome(s) {
  // TODO: return true if s reads the same forwards and backwards
  return false;
}

const s = require("fs").readFileSync(0, "utf-8").trim();
console.log(isPalindrome(s).toString().toLowerCase());`,
    },
    testCases: [
      { input: "racecar\n", expectedOutput: "true", hidden: false },
      { input: "hello\n", expectedOutput: "false", hidden: false },
      { input: "a\n", expectedOutput: "true", hidden: true },
      { input: "abccba\n", expectedOutput: "true", hidden: true },
      { input: "smartness\n", expectedOutput: "false", hidden: true },
    ],
  },
  {
    title: "Reverse a String",
    slug: "reverse-string",
    description: `## Reverse a String

Read a line of text and print it **reversed**.

### Examples

\`\`\`text
Input:  hello
Output: olleh

Input:  CodeCraft
Output: tfarCedoC
\`\`\`

### Constraints

- The text contains only letters and spaces.
- 1 <= len <= 100000 — memory matters, use O(1) where possible.`,
    difficulty: "Beginner",
    languages: ["python", "javascript", "go"],
    points: 25,
    tags: ["strings"],
    starterCode: {
      python: `import sys

def reverse_string(s: str) -> str:
    # TODO: implement
    return ""

if __name__ == "__main__":
    s = sys.stdin.read().rstrip("\\n")
    print(reverse_string(s))`,
      javascript: `function reverseString(s) {
  // TODO: implement
  return "";
}

const s = require("fs").readFileSync(0, "utf-8").replace(/\\n$/, "");
console.log(reverseString(s));`,
      go: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func reverse(s string) string {
    // TODO: implement
    return ""
}

func main() {
    reader := bufio.NewReader(os.Stdin)
    s, _ := reader.ReadString('\\n')
    s = strings.TrimSuffix(s, "\\n")
    fmt.Println(reverse(s))
}`,
    },
    testCases: [
      { input: "hello\n", expectedOutput: "olleh", hidden: false },
      { input: "CodeCraft\n", expectedOutput: "tfarCedoC", hidden: false },
      { input: "a\n", expectedOutput: "a", hidden: true },
      { input: "level\n", expectedOutput: "level", hidden: true },
    ],
  },
];
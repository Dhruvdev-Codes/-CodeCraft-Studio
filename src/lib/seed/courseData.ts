// Seed data for the platform's interactive course hub.
// Lesson content is written in Markdown (rendered by react-markdown).

export const SEED_COURSES = [
  {
    title: "Python Fundamentals",
    slug: "python-fundamentals",
    description:
      "Start your programming journey here. Learn variables, control flow, and functions — the core building blocks of every Python program.",
    language: "python",
    difficulty: "Beginner",
    icon: "🐍",
    order: 1,
    lessons: [
      {
        title: "Welcome to Python",
        slug: "welcome-to-python",
        order: 1,
        duration: "8 min",
        language: "python",
        code: `# Your first Python program
name = "CodeCraft"
print(f"Welcome to {name}!")
print("Let's write some code together.")`,
        content: `## Why Python?

Python is one of the friendliest programming languages for beginners while also
powering some of the world's most serious software — from web backends with
Django to machine learning with PyTorch.

### Python is readable

Python uses **indentation** instead of curly braces to group code. That means
the code you write looks almost like an outline of what you want to do:

\`\`\`python
# A tiny programme that greets the user
name = input("What is your name? ")
print(f"Hello, {name}!")
\`\`\`

### Running Python

You can run Python in two common ways:

1. **Interactively** — type \`python\` in a terminal and write code line by line.
2. **From a file** — save code in a \`.py\` file and run it with \`python file.py\`.

In CodeCraft Studio you will use the second approach inside the cloud IDE, with
the built-in sandbox doing all the heavy lifting securely in the background.

### The print function

\`print()\` is how Python sends output to the screen. Anything between the
parentheses is displayed:

\`\`\`python
print("Hello, World!")
print(3 + 4)      # numbers do not need quotes
print("Sum:", 3 + 4)
\`\`\`

> **Try it:** hit the ▶ Run button in the playground below. Then change the
> message and re-run. Experimenting is the fastest way to learn.

### Key takeaways

- Python is beginner-friendly and widely used.
- Indentation is part of the syntax — be consistent!
- \`print()\` displays output; the sandbox compares program output to expected
  output exactly (ignoring trailing whitespace).`,
      },
      {
        title: "Variables & Data Types",
        slug: "variables-and-data-types",
        order: 2,
        duration: "12 min",
        language: "python",
        code: `# Variables hold data
age = 21                  # integer
pi = 3.14159              # float
name = "Ada Lovelace"     # string
is_ready = True           # boolean

print(type(age), type(name))
print(f"{name} is {age} years old")`,
        content: `## Variables & Data Types

A variable is a named box that stores a value. Python creates the box the first
time you assign to it — no declaration needed.

### Core data types

| Type    | Example                | Purpose                      |
| ------- | ---------------------- | ---------------------------- |
| \`int\`     | \`count = 3\`             | Whole numbers                |
| \`float\`   | \`price = 9.99\`          | Decimal numbers              |
| \`str\`     | \`name = "Ada"\`          | Text                         |
| \`bool\`    | \`done = True\`           | True / False values          |
| \`list\`    | \`fruits = ["a", "b"]\`   | Ordered, changeable sequence |
| \`dict\`    | \`person = {"name": "A"}\` | Key → value pairs            |

### Type is dynamic

Python infers types for you and allows re-binding a variable to another type:

\`\`\`python
x = 10        # int
x = "ten"     # now a string!
\`\`\`

Use \`type(x)\` to ask what a variable currently holds.

### Type conversion

Sometimes you need to convert types explicitly:

\`\`\`python
age = input("Age: ")   # always a string
age = int(age)         # convert to integer
print(age + 1)
\`\`\`

### Naming conventions

- Use \`snake_case\`: \`student_score\`, \`total_price\`.
- Names must start with a letter or underscore.
- Be descriptive: \`balance\` not \`b\`.

### Common pitfall

\`\`\`python
print("1" + 1)   # TypeError — cannot mix str and int with +
\`\`\`

Either convert the string to an int, or use an f-string:

\`\`\`python
print(f"1" + f"{1}")   # "11"
\`\`\`

> **Task:** In the playground, create a few variables of each type, print them,
> and print their \`type\`.`,
      },
  {
    title: "Control Flow",
    slug: "control-flow",
    order: 3,
    duration: "15 min",
    language: "python",
    code: `# Conditions and loops
n = int(input("Enter a number: "))

if n % 2 == 0:
    print("Even")
else:
    print("Odd")

for i in range(1, n + 1):
    print(i, end=" ")
print()`,
    content: `## Control Flow

Programs make decisions (\`if\`) and repeat work (\`for\` / \`while\`).

### Conditionals

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
print(grade)
\`\`\`

**Comparison operators:** \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
**Logical operators:** \`and\`, \`or\`, \`not\`

### for loops — iterating

\`\`\`python
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)

for fruit in ["apple", "banana"]:
    print(fruit)
\`\`\`

\`range(start, stop, step)\` gives you precise control:

\`\`\`python
for even in range(0, 11, 2):
    print(even, end=" ")   # 0 2 4 6 8 10
\`\`\`

### while loops — repeating until a condition

\`\`\`python
total, n = 0, 1
while n <= 10:
    total += n
    n += 1
print(total)  # 55
\`\`\`

> ⚠️ **Infinite loop warning:** always make sure the loop condition eventually
> becomes false.

### break and continue

- \`break\` exits the loop immediately.
- \`continue\` skips to the next iteration.

\`\`\`python
for i in range(1, 20):
    if i % 3 == 0:
        continue          # skip multiples of 3
    if i > 15:
        break             # stop early
    print(i)
\`\`\`

> **Task:** Print every number from 1 to 20, replacing multiples of 3 with
> "Fizz" and multiples of 5 with "Buzz". That classic is a problem in the
> Arena!`,
  },
  {
    title: "Functions",
    slug: "functions",
    order: 4,
    duration: "15 min",
    language: "python",
    code: `def greet(name):
    return f"Hello, {name}!"

def main():
    user = "CodeCrafter"
    print(greet(user))

if __name__ == "__main__":
    main()`,
    content: `## Functions

Functions package reusable logic into named units. They take inputs
(*parameters*), do work, and usually return a result.

### Defining and calling

\`\`\`python
def square(x):
    return x * x

print(square(5))   # 25
\`\`\`

- \`def\` keyword declares the function.
- Indented body follows the \`:\`.
- \`return\` hands a value back; omitting it returns \`None\`.

### Default and keyword arguments

\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))        # 9    — exponent defaults to 2
print(power(3, 3))     # 27
print(power(exponent=4, base=2))  # 16
\`\`\`

### Why functions matter

1. **Reuse** — write once, call anywhere.
2. **Abstraction** — callers don't care how it works, just what it returns.
3. **Testability** — tiny functions are easy to verify.
4. **Readability** — names explain intent.

This last property is why every coding contest on CodeCraft expects your
solution to be structured into small, well-named functions.

### The main guard

When a Python script is run directly, \`__name__\` is \`"__main__"\`. The guard
below keeps your module importable without side-effects:

\`\`\`python
def main():
    print("Running as a script")

if __name__ == "__main__":
    main()
\`\`\`

### Scope

Variables created inside a function are *local* — they cannot leak out:

\`\`\`python
def add_one(x):
    result = x + 1   # local
    return result

add_one(5)
# print(result)  -> NameError: result is not defined
\`\`\`

> **Task:** Rewrite the FizzBuzz logic from the previous lesson as a function
> \`fizzbuzz(n)\` that returns a single string, then print its output for n=15.`,
      },
    ],
  },
  {
    title: "Python Intermediate",
    slug: "python-intermediate",
    description:
      "Level up with lists, dictionaries, comprehensions, and object-oriented programming. Perfect after finishing Python Fundamentals.",
    language: "python",
    difficulty: "Intermediate",
    icon: "🧠",
    order: 2,
    lessons: [
      {
        title: "Lists & Dictionaries",
        slug: "lists-and-dictionaries",
        order: 1,
        duration: "14 min",
        language: "python",
        code: `scores = [88, 92, 79, 94, 85]
print("Max:", max(scores))
print("Sum:", sum(scores))

grades = {"Alice": 92, "Bob": 79}
for name, score in grades.items():
    print(f"{name}: {score}")`,
        content: `## Lists & Dictionaries

Two of the most useful data structures in Python.

### Lists — ordered sequences

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")       # add to the end
fruits[0]                   # "apple"
fruits[-1]                  # "date"
len(fruits)                 # 4
fruits[1:3]                 # ["banana", "cherry"] — slicing
\`\`\`

### List comprehensions

The Pythonic one-liner for building lists:

\`\`\`python
squares = [x * x for x in range(10)]        # [0, 1, 4, 9, ..., 81]

evens = [x for x in range(20) if x % 2 == 0]
\`\`\`

### Dictionaries — key → value lookup

\`\`\`python
person = {"name": "Ada", "role": "developer"}

person["name"]          # "Ada"
person.get("age", 0)    # 0 (safe access with default)
person["age"] = 36      # add or update
for key, value in person.items():
    print(key, value)
\`\`\`

### When to use which

- **List**: ordered sequence, duplicates allowed, index access.
- **Dict**: fast lookups by key, unique keys.
- **Set**: unique elements, fast membership tests (\`x in s\`).

> **Task:** Build a word frequency counter: split a sentence, count each word
> into a dictionary, and print the most common word.`,
      },
      {
        title: "Classes & Objects",
        slug: "classes-and-objects",
        order: 2,
        duration: "18 min",
        language: "python",
        code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance

acct = BankAccount("Ada")
print(acct.deposit(100))
print(acct.withdraw(30))`,
        content: `## Classes & Objects

Objects bundle *state* (attributes) with *behavior* (methods).

### Defining a class

\`\`\`python
class Dog:
    # class attribute — shared by all instances
    species = "Canis familiaris"

    def __init__(self, name, age):
        self.name = name   # instance attribute
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

rex = Dog("Rex", 3)
print(rex.bark())      # Rex says woof!
print(Dog.species)     # Canis familiaris
\`\`\`

### The three "dunder" methods you will use most

- \`__init__\` — constructor: runs when you create an instance.
- \`__str__\` — human-readable string representation (used by \`print\`).
- \`__repr__\` — unambiguous representation (used by the REPL).

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):
        return f"({self.x}, {self.y})"

print(Point(3, 4))   # (3, 4)
\`\`\`

### Inheritance

A subclass *extends* a parent, inheriting methods and adding its own:

\`\`\`python
class Animal:
    def speak(self):
        return "...generic sound..."

class Cat(Animal):
    def speak(self):
        return "Meow!"

class Dog(Animal):
    pass  # inherits Animal.speak

print(Cat().speak())   # Meow!
print(Dog().speak())   # ...generic sound...
\`\`\`

### Why OOP matters in contests

Interactive judges run your code against thousands of inputs. Well-structured
classes make your solution readable, testable, and easy to extend when hidden
test cases reveal edge cases.

> **Task:** Build a \`Stack\` class with \`push\`, \`pop\`, and \`is_empty\`
> methods backed by a list.`,
      },
    ],
  },
  {
    title: "JavaScript Essentials",
    slug: "javascript-essentials",
    description:
      "The language of the web. Master variables, functions, arrays, and objects used across browsers, Node.js, and competitive programming.",
    language: "javascript",
    difficulty: "Beginner",
    icon: "🟨",
    order: 3,
    lessons: [
      {
        title: "Variables, Types & Functions",
        slug: "js-variables-functions",
        order: 1,
        duration: "15 min",
        language: "javascript",
        code: `// let vs const vs var
let score = 10;          // mutable
const player = "Ada";    // immutable binding
var legacy = "avoid me"; // function-scoped

function add(a, b) {
  return a + b;
}

const arrow = (a, b) => a * b;   // arrow function

console.log(add(score, 5));
console.log(arrow(3, 4));`,
        content: `## JavaScript Variables, Types & Functions

### Declaring variables

\`\`\`javascript
let count = 0;        // can be reassigned
const PI = 3.14159;   // cannot be reassigned (prefer this)
var old = "legacy";   // avoid — hoisting surprises
\`\`\`

**Rule of thumb:** use \`const\` by default, \`let\` when you must reassign.

### Data types

\`\`\`javascript
let n = 42;            // number
let s = "hello";       // string
let b = true;          // boolean
let arr = [1, 2, 3];   // array
let obj = { x: 1 };    // object
let nothing = null;    // null
let undef = undefined; // undefined
\`\`\`

Use \`typeof\` to inspect: \`typeof 42 === "number"\`.

### Functions — three flavors

\`\`\`javascript
// function declaration (hoisted)
function add(a, b) { return a + b; }

// function expression
const sub = function (a, b) { return a - b; };

// arrow function (modern favorite)
const mul = (a, b) => a * b;
\`\`\`

### Template literals

Backtick strings interpolate with \`\${...}\`:

\`\`\`javascript
const name = "Ada";
console.log(\`Hello, \${name}!\`);   // Hello, Ada!
\`\`\`

### Comparing values

- \`==\` compares loosely (coerces types) — avoid it.
- \`===\` compares strictly by type and value — always prefer it.

\`\`\`javascript
5 == "5"    // true   (coerced)
5 === "5"   // false  (different types)
\`\`\`

### Reading stdin in the sandbox

Contest problems read standard input through \`fs\`:

\`\`\`javascript
const data = require("fs").readFileSync(0, "utf-8").trim();
console.log(\`Got: \${data}\`);
\`\`\`

> **Task:** Write an arrow function \`square(n)\` and print squares for the
> numbers 1 through 5.`,
      },
      {
        title: "Arrays & Objects",
        slug: "js-arrays-objects",
        order: 2,
        duration: "16 min",
        language: "javascript",
        code: `const scores = [88, 92, 79];

scores.push(95);

const doubled = scores.map(s => s * 2);
const top = scores.filter(s => s >= 90);

console.log(doubled);
console.log(top);

const user = { name: "Ada", role: "developer" };
console.log(user.name);
console.log(Object.keys(user));`,
        content: `## Arrays & Objects

Arrays and objects are the workhorses of every JavaScript program.

### Array essentials

\`\`\`javascript
const nums = [3, 1, 4, 1, 5];
nums.push(9);          // append
nums.pop();            // remove last
nums[0];               // index access
nums.length;           // size
nums.slice(1, 3);      // copy subset
\`\`\`

### Iteration

\`\`\`javascript
for (const n of nums) {
  console.log(n);
}

nums.forEach((n, index) => console.log(index, n));
\`\`\`

### map / filter / reduce

These describe transformations without mutable loop counters:

\`\`\`javascript
const doubled = nums.map((n) => n * 2);        // [6, 2, 8, 2, 10]
const evens = nums.filter((n) => n % 2 === 0);  // [4]
const total = nums.reduce((sum, n) => sum + n, 0); // 14
\`\`\`

### Objects

\`\`\`javascript
const user = {
  name: "Ada",
  skills: ["Math", "Coding"],
  greet() {
    return \`Hi, I'm \${this.name}\`;
  },
};

user.skills.push("Poetry");
console.log(user.greet());
console.log(Object.keys(user));
\`\`\`

### Destructuring — grab fields cleanly

\`\`\`javascript
const { name, skills } = user;
const [first, second] = skills;
\`\`\`

### Sorting

Remember: \`Array#sort\` sorts **lexicographically** by default. Use a
comparator for numbers:

\`\`\`javascript
[10, 2, 1].sort();                // [1, 10, 2]  — string sort!
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]  — numeric sort
\`\`\`

> **Task:** Given an array of scores, compute the average with \`reduce\`, then
> filter to show only passing scores (≥ 60).`,
      },
    ],
  },
];
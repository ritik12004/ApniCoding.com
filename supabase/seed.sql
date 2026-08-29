-- Seed Data for apnicoding.com
-- Run this after schema.sql in Supabase SQL Editor

-- Insert Courses
INSERT INTO courses (title, slug, description, icon) VALUES
('Python Programming', 'python', 'From basics to advanced: variables, loops, functions, OOP, data structures, and algorithms.', '🐍'),
('C++ Fundamentals', 'cpp', 'Master C++: memory management, STL, templates, OOP, and competitive programming techniques.', '⚙️'),
('JavaScript & TypeScript', 'javascript', 'Modern JS/TS: ES6+, async/await, DOM, TypeScript types, React fundamentals, and Node.js.', '📜'),
('Data Structures & Algorithms', 'dsa', 'Arrays, linked lists, trees, graphs, sorting, searching, DP, and 100+ LeetCode-style problems.', '🧮'),
('Java Programming', 'java', 'Core Java, OOP, collections, streams, multithreading, and Spring Boot basics.', '☕'),
('Go & Rust Systems', 'go-rust', 'Concurrency in Go, memory safety in Rust, systems programming, and backend development.', '🦀')
ON CONFLICT (slug) DO NOTHING;

-- Insert Lessons for Python Course
WITH python_course AS (
  SELECT id FROM courses WHERE slug = 'python'
)
INSERT INTO lessons (course_id, title, slug, content_markdown, order_index)
SELECT 
  python_course.id,
  lesson_data.title,
  lesson_data.slug,
  lesson_data.content,
  lesson_data.order_index
FROM python_course,
(VALUES
  (1, 'Introduction to Python', 'introduction', '# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Why Python?

- **Easy to learn** - Clean syntax that reads like English
- **Versatile** - Web development, data science, AI, automation
- **Large community** - Extensive libraries and frameworks

## Your First Program

```python
print("Hello, World!")
```

**Output:**
```
Hello, World!
```

## Variables and Data Types

Python is dynamically typed - you don''t need to declare variable types.

```python
name = "Alice"        # String
age = 25              # Integer
height = 5.6          # Float
is_student = True     # Boolean
```

> 💡 **Tip**: Use descriptive variable names for readable code!', 'introduction'),

  (2, 'Variables and Types', 'variables-and-types', '# Variables and Data Types

## Understanding Variables

Variables are containers for storing data values. In Python, you don''t need to declare the type.

```python
# String
first_name = "John"
last_name = "Doe"

# Integer
age = 30
year = 2024

# Float
price = 19.99
temperature = -5.5

# Boolean
is_active = True
has_permission = False
```

## Type Checking

Use `type()` to check a variable''s type:

```python
print(type(name))    # <class ''str''>
print(type(age))     # <class ''int''>
print(type(price))   # <class ''float''>
print(type(is_active)) # <class ''bool''>
```

## Type Conversion

Convert between types when needed:

```python
# String to number
age_str = "25"
age_int = int(age_str)      # 25
age_float = float(age_str)  # 25.0

# Number to string
number = 42
text = str(number)          # "42"

# Boolean conversion
bool(0)       # False
bool(1)       # True
bool("")      # False
bool("text")  # True
```

## Naming Conventions

- Use **snake_case** for variables: `user_name`, `total_count`
- Use **UPPER_CASE** for constants: `MAX_SIZE`, `API_KEY`
- Avoid reserved keywords: `class`, `def`, `if`, `else`, etc.', 'variables-and-types'),

  (3, 'Control Flow: If Statements', 'control-flow-if', '# Control Flow: If Statements

## Making Decisions

Control flow allows your program to make decisions based on conditions.

```python
age = 18

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
```

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equal to |
| `!=` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |

## Logical Operators

Combine conditions with `and`, `or`, `not`:

```python
age = 25
has_license = True

if age >= 18 and has_license:
    print("Can drive")

is_student = True
has_job = False

if is_student or has_job:
    print("Busy person")

if not has_job:
    print("Looking for work")
```

## Truthy and Falsy Values

In Python, these values are **falsy**:
- `False`, `None`, `0`, `0.0`
- Empty sequences: `""`, `[]`, `()`, `{}`
- Everything else is **truthy**', 'control-flow-if'),

  (4, 'Loops: For and While', 'loops', '# Loops: For and While

## For Loops

Iterate over sequences (lists, strings, ranges):

```python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Iterate over a range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# Iterate with index
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
```

## While Loops

Repeat while a condition is true:

```python
count = 0
while count < 5:
    print(count)
    count += 1  # Don''t forget to increment!
```

## Loop Control

- `break` - Exit the loop
- `continue` - Skip to next iteration
- `else` - Runs when loop completes normally (no break)

```python
for i in range(10):
    if i == 3:
        continue  # Skip 3
    if i == 7:
        break     # Stop at 7
    print(i)
```

## Nested Loops

```python
matrix = [[1, 2], [3, 4], [5, 6]]
for row in matrix:
    for item in row:
        print(item, end=" ")
    print()  # New line after each row
```', 'loops'),

  (5, 'Functions', 'functions', '# Functions

## Defining Functions

Functions are reusable blocks of code:

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
```

## Parameters and Arguments

```python
# Positional arguments
def add(a, b):
    return a + b

# Keyword arguments
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Bob")              # Hello, Bob!
greet("Bob", "Hi")        # Hi, Bob!
greet(greeting="Hey", name="Bob")  # Hey, Bob!
```

## Default Parameters

```python
def create_user(name, role="user", active=True):
    return {"name": name, "role": role, "active": active}

create_user("Alice")                    # Default role, active
create_user("Bob", "admin")             # Admin role
create_user("Charlie", active=False)    # Inactive user
```

## Return Values

```python
def calculate(a, b):
    sum_result = a + b
    diff_result = a - b
    return sum_result, diff_result  # Returns tuple

sum_val, diff_val = calculate(10, 5)
print(sum_val)   # 15
print(diff_val)  # 5
```

## Lambda Functions

Anonymous functions for simple operations:

```python
# Regular function
def square(x):
    return x * x

# Lambda equivalent
square = lambda x: x * x

# Use with map, filter
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
```', 'functions'),

  (6, 'Lists and Dictionaries', 'lists-dicts', '# Lists and Dictionaries

## Lists

Ordered, mutable collections:

```python
# Creating lists
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# Accessing elements
print(fruits[0])    # apple (first)
print(fruits[-1])   # cherry (last)

# Slicing
print(fruits[0:2])  # ["apple", "banana"]
print(fruits[:2])   # Same as above
print(fruits[1:])   # ["banana", "cherry"]
```

## List Methods

```python
fruits = ["apple", "banana"]

fruits.append("cherry")      # Add to end
fruits.insert(1, "orange")   # Insert at index
fruits.remove("banana")      # Remove by value
popped = fruits.pop()        # Remove and return last
fruits.clear()               # Remove all

print(len(fruits))           # Length
print("apple" in fruits)     # Check membership
```

## Dictionaries

Key-value pairs, unordered (ordered in Python 3.7+):

```python
# Creating dictionaries
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Accessing values
print(person["name"])        # Alice
print(person.get("age"))     # 25 (safe access)
print(person.get("job", "N/A"))  # N/A (default)

# Modifying
person["age"] = 26
person["job"] = "Engineer"
del person["city"]

# Methods
print(person.keys())     # dict_keys(['name', 'age', 'job'])
print(person.values())   # dict_values(['Alice', 26, 'Engineer'])
print(person.items())    # dict_items([('name', 'Alice'), ...])
```

## Dictionary Comprehension

```python
# Create from lists
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

people = {name: age for name, age in zip(names, ages)}
# {"Alice": 25, "Bob": 30, "Charlie": 35}

# Filter
adults = {name: age for name, age in people.items() if age >= 30}
```', 'lists-dicts'),

  (7, 'File I/O', 'file-io', '# File Input/Output

## Reading Files

```python
# Read entire file
with open("data.txt", "r") as file:
    content = file.read()
    print(content)

# Read line by line
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())  # Remove newline

# Read all lines into list
with open("data.txt", "r") as file:
    lines = file.readlines()
```

## Writing Files

```python
# Write (overwrites)
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("Second line\n")

# Append
with open("output.txt", "a") as file:
    file.write("Appended line\n")
```

## JSON Files

```python
import json

data = {
    "name": "Alice",
    "age": 25,
    "skills": ["Python", "JavaScript"]
}

# Write JSON
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Read JSON
with open("data.json", "r") as file:
    loaded = json.load(file)
```

## Error Handling

```python
try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("File not found!")
except PermissionError:
    print("Permission denied!")
except Exception as e:
    print(f"Error: {e}")
```', 'file-io'),

  (8, 'Error Handling', 'error-handling', '# Error Handling

## Try-Except Blocks

Handle exceptions gracefully:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple exceptions
try:
    value = int("abc")
except ValueError:
    print("Invalid number!")
except Exception as e:
    print(f"Other error: {e}")
```

## Else and Finally

```python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Error!")
else:
    print(f"Result: {result}")  # Runs if no exception
finally:
    print("Cleanup here")  # Always runs
```

## Raising Exceptions

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

try:
    divide(10, 0)
except ValueError as e:
    print(e)  # Cannot divide by zero
```

## Custom Exceptions

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Insufficient funds: {balance} < {amount}")

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount
```', 'error-handling')
) AS lesson_data(order_index, title, slug, content)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Insert Lessons for JavaScript Course
WITH js_course AS (
  SELECT id FROM courses WHERE slug = 'javascript'
)
INSERT INTO lessons (course_id, title, slug, content_markdown, order_index)
SELECT 
  js_course.id,
  lesson_data.title,
  lesson_data.slug,
  lesson_data.content,
  lesson_data.order_index
FROM js_course,
(VALUES
  (1, 'Introduction to JavaScript', 'introduction', '# Introduction to JavaScript

JavaScript is the programming language of the web. It runs in browsers and on servers (Node.js).

## Why JavaScript?

- **Runs everywhere** - Browsers, servers, mobile, desktop
- **Huge ecosystem** - npm has 1M+ packages
- **Versatile** - Frontend, backend, full-stack

## Your First Script

```javascript
console.log("Hello, World!");
```

## Variables

```javascript
// Modern (ES6+)
const name = "Alice";      // Constant (preferred)
let age = 25;              // Reassignable
var oldStyle = "avoid";    // Legacy (avoid)

// Data types
const str = "hello";       // String
const num = 42;            // Number
const flag = true;         // Boolean
const nothing = null;      // Null
const notDefined = undefined; // Undefined
```', 'introduction'),

  (2, 'Variables and Data Types', 'variables-types', '# Variables and Data Types

## Primitive Types

```javascript
// String
const message = "Hello";
const template = `Hello, ${name}!`;  // Template literal

// Number
const integer = 42;
const float = 3.14;
const scientific = 1e5;      // 100000
const hex = 0xFF;            // 255

// Boolean
const isActive = true;
const isComplete = false;

// Special
const empty = null;
const notSet = undefined;
const sym = Symbol("id");
```

## Objects and Arrays

```javascript
// Object
const person = {
  name: "Alice",
  age: 25,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

// Array
const colors = ["red", "green", "blue"];
const mixed = [1, "two", { three: 3 }];
```', 'variables-types'),

  (3, 'Functions', 'functions', '# Functions

## Function Declarations

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow functions (ES6)
const greet = (name) => `Hello, ${name}!`;

// With default parameters
const greet = (name = "Guest") => `Hello, ${name}!`;

// Rest parameters
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
```', 'functions')
) AS lesson_data(order_index, title, slug, content)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Insert sample problems for Python course
WITH python_lessons AS (
  SELECT id, slug FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'python')
)
INSERT INTO problems (lesson_id, title, description, starter_code, test_cases_json, difficulty)
SELECT 
  python_lessons.id,
  prob_data.title,
  prob_data.description,
  prob_data.starter_code,
  prob_data.test_cases,
  prob_data.difficulty
FROM python_lessons,
(VALUES
  (
    'variables',
    'Hello World',
    'Write a program that prints "Hello, World!" to the console.',
    'print("Hello, World!")',
    '[{"input": "", "expected_output": "Hello, World!", "is_hidden": false, "explanation": "Simple print statement"}]',
    'easy'
  ),
  (
    'variables',
    'Sum of Two Numbers',
    'Read two integers from input and print their sum.',
    'a = int(input())\nb = int(input())\nprint(a + b)',
    '[{"input": "5\n3", "expected_output": "8", "is_hidden": false}, {"input": "10\n20", "expected_output": "30", "is_hidden": false}, {"input": "-5\n3", "expected_output": "-2", "is_hidden": true}]',
    'easy'
  ),
  (
    'control-flow-if',
    'Even or Odd',
    'Given an integer, determine if it is even or odd.',
    'n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
    '[{"input": "4", "expected_output": "Even", "is_hidden": false}, {"input": "7", "expected_output": "Odd", "is_hidden": false}, {"input": "0", "expected_output": "Even", "is_hidden": true}]',
    'easy'
  ),
  (
    'loops',
    'Sum of First N Numbers',
    'Calculate the sum of first N natural numbers.',
    'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)',
    '[{"input": "5", "expected_output": "15", "is_hidden": false}, {"input": "10", "expected_output": "55", "is_hidden": false}, {"input": "100", "expected_output": "5050", "is_hidden": true}]',
    'easy'
  ),
  (
    'functions',
    'Factorial Function',
    'Write a function to calculate factorial of a number.',
    'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(factorial(n))',
    '[{"input": "5", "expected_output": "120", "is_hidden": false}, {"input": "0", "expected_output": "1", "is_hidden": false}, {"input": "10", "expected_output": "3628800", "is_hidden": true}]',
    'medium'
  )
) AS prob_data(lesson_slug, title, description, starter_code, test_cases, difficulty)
ON CONFLICT DO NOTHING;
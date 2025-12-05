// DSA Templates and Code Snippets Library

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  code: string;
  tags: string[];
  isCustom?: boolean;
  authorId?: string;
}

export const templateCategories = [
  "Searching",
  "Sorting",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks & Queues",
  "Hash Tables",
  "Greedy",
  "Backtracking",
  "Math",
  "Bit Manipulation",
];

// Pre-built DSA Templates
export const builtInTemplates: Template[] = [
  // Binary Search
  {
    id: "binary-search-js",
    name: "Binary Search",
    description: "Binary search algorithm template",
    category: "Searching",
    language: "javascript",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}

// Example usage
const arr = [1, 3, 5, 7, 9, 11, 13];
const target = 7;
console.log(binarySearch(arr, target));`,
    tags: ["binary-search", "searching", "array"],
  },
  {
    id: "binary-search-py",
    name: "Binary Search",
    description: "Binary search algorithm template",
    category: "Searching",
    language: "python",
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found

# Example usage
arr = [1, 3, 5, 7, 9, 11, 13]
target = 7
print(binary_search(arr, target))`,
    tags: ["binary-search", "searching", "array"],
  },
  {
    id: "binary-search-cpp",
    name: "Binary Search",
    description: "Binary search algorithm template",
    category: "Searching",
    language: "cpp",
    code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    int target = 7;
    cout << binarySearch(arr, target) << endl;
    return 0;
}`,
    tags: ["binary-search", "searching", "array"],
  },
  {
    id: "binary-search-java",
    name: "Binary Search",
    description: "Binary search algorithm template",
    category: "Searching",
    language: "java",
    code: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Not found
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13};
        int target = 7;
        System.out.println(binarySearch(arr, target));
    }
}`,
    tags: ["binary-search", "searching", "array"],
  },
  
  // DFS (Depth-First Search)
  {
    id: "dfs-js",
    name: "DFS - Depth First Search",
    description: "DFS traversal for graphs/trees",
    category: "Graphs",
    language: "javascript",
    code: `// DFS using recursion
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);
  
  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// DFS using stack (iterative)
function dfsIterative(graph, start) {
  const stack = [start];
  const visited = new Set();
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      console.log(node);
      
      for (const neighbor of graph[node] || []) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
}

// Example usage
const graph = {
  1: [2, 3],
  2: [4],
  3: [5],
  4: [],
  5: []
};
dfs(graph, 1);`,
    tags: ["dfs", "graph", "traversal", "recursion"],
  },
  {
    id: "dfs-py",
    name: "DFS - Depth First Search",
    description: "DFS traversal for graphs/trees",
    category: "Graphs",
    language: "python",
    code: `# DFS using recursion
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(node)
    print(node)
    
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# DFS using stack (iterative)
def dfs_iterative(graph, start):
    stack = [start]
    visited = set()
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            print(node)
            
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    stack.append(neighbor)

# Example usage
graph = {
    1: [2, 3],
    2: [4],
    3: [5],
    4: [],
    5: []
}
dfs(graph, 1)`,
    tags: ["dfs", "graph", "traversal", "recursion"],
  },
  
  // BFS (Breadth-First Search)
  {
    id: "bfs-js",
    name: "BFS - Breadth First Search",
    description: "BFS traversal for graphs/trees",
    category: "Graphs",
    language: "javascript",
    code: `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

// Example usage
const graph = {
  1: [2, 3],
  2: [4],
  3: [5],
  4: [],
  5: []
};
bfs(graph, 1);`,
    tags: ["bfs", "graph", "traversal", "queue"],
  },
  {
    id: "bfs-py",
    name: "BFS - Breadth First Search",
    description: "BFS traversal for graphs/trees",
    category: "Graphs",
    language: "python",
    code: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    
    while queue:
        node = queue.popleft()
        print(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Example usage
graph = {
    1: [2, 3],
    2: [4],
    3: [5],
    4: [],
    5: []
}
bfs(graph, 1)`,
    tags: ["bfs", "graph", "traversal", "queue"],
  },
  
  // Quick Sort
  {
    id: "quicksort-js",
    name: "Quick Sort",
    description: "Quick sort algorithm implementation",
    category: "Sorting",
    language: "javascript",
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];
  
  for (const num of arr) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else middle.push(num);
  }
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example usage
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(arr));`,
    tags: ["quicksort", "sorting", "divide-conquer"],
  },
  {
    id: "quicksort-py",
    name: "Quick Sort",
    description: "Quick sort algorithm implementation",
    category: "Sorting",
    language: "python",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(arr))`,
    tags: ["quicksort", "sorting", "divide-conquer"],
  },
  
  // Merge Sort
  {
    id: "mergesort-js",
    name: "Merge Sort",
    description: "Merge sort algorithm implementation",
    category: "Sorting",
    language: "javascript",
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Example usage
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(mergeSort(arr));`,
    tags: ["mergesort", "sorting", "divide-conquer"],
  },
  
  // Tree Traversal
  {
    id: "tree-traversal-js",
    name: "Tree Traversal (Inorder, Preorder, Postorder)",
    description: "Binary tree traversal templates",
    category: "Trees",
    language: "javascript",
    code: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Inorder: Left -> Root -> Right
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Preorder: Root -> Left -> Right
function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Postorder: Left -> Right -> Root
function postorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  
  traverse(root);
  return result;
}

// Example usage
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log("Inorder:", inorderTraversal(root));
console.log("Preorder:", preorderTraversal(root));
console.log("Postorder:", postorderTraversal(root));`,
    tags: ["tree", "traversal", "binary-tree", "recursion"],
  },
  
  // Dynamic Programming - Fibonacci
  {
    id: "fibonacci-dp-js",
    name: "Fibonacci (DP)",
    description: "Fibonacci using dynamic programming",
    category: "Dynamic Programming",
    language: "javascript",
    code: `// Memoization (Top-down)
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Tabulation (Bottom-up)
function fibonacciTab(n) {
  if (n <= 2) return 1;
  
  const dp = [0, 1, 1];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Space-optimized
function fibonacciOptimized(n) {
  if (n <= 2) return 1;
  
  let prev = 1, curr = 1;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}

// Example usage
console.log(fibonacciMemo(10));
console.log(fibonacciTab(10));
console.log(fibonacciOptimized(10));`,
    tags: ["fibonacci", "dynamic-programming", "memoization"],
  },
  
  // Two Pointers
  {
    id: "two-pointers-js",
    name: "Two Pointers Technique",
    description: "Two pointers pattern for array problems",
    category: "Arrays",
    language: "javascript",
    code: `// Example: Find pair with target sum
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1]; // Not found
}

// Example: Remove duplicates from sorted array
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  
  let slow = 0;
  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  
  return slow + 1;
}

// Example usage
const arr = [1, 2, 3, 4, 5, 6];
console.log(twoSum(arr, 7)); // [0, 5]`,
    tags: ["two-pointers", "array", "technique"],
  },
  
  // Sliding Window
  {
    id: "sliding-window-js",
    name: "Sliding Window",
    description: "Sliding window technique template",
    category: "Arrays",
    language: "javascript",
    code: `// Example: Maximum sum of subarray of size k
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = 0;
  
  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}

// Example: Longest substring without repeating characters
function longestUniqueSubstring(s) {
  const charMap = new Map();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    if (charMap.has(s[right])) {
      left = Math.max(left, charMap.get(s[right]) + 1);
    }
    charMap.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}

// Example usage
const arr = [1, 4, 2, 10, 2, 3, 1, 0, 20];
console.log(maxSumSubarray(arr, 4));`,
    tags: ["sliding-window", "array", "technique"],
  },
  
  // Linked List
  {
    id: "linked-list-js",
    name: "Linked List Operations",
    description: "Basic linked list implementation",
    category: "Linked Lists",
    language: "javascript",
    code: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  // Insert at end
  append(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }
  
  // Insert at beginning
  prepend(val) {
    this.head = new ListNode(val, this.head);
  }
  
  // Delete node
  delete(val) {
    if (!this.head) return;
    
    if (this.head.val === val) {
      this.head = this.head.next;
      return;
    }
    
    let current = this.head;
    while (current.next && current.next.val !== val) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
    }
  }
  
  // Print list
  print() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.val);
      current = current.next;
    }
    console.log(values.join(" -> "));
  }
}

// Example usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print();`,
    tags: ["linked-list", "data-structure"],
  },
  
  // Stack
  {
    id: "stack-js",
    name: "Stack Implementation",
    description: "Stack data structure",
    category: "Stacks & Queues",
    language: "javascript",
    code: `class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return "Stack is empty";
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  print() {
    console.log(this.items);
  }
}

// Example: Balanced parentheses
function isBalanced(s) {
  const stack = new Stack();
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (const char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (stack.isEmpty() || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  
  return stack.isEmpty();
}

// Example usage
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
stack.print();
console.log(isBalanced("()[]{}"));`,
    tags: ["stack", "data-structure"],
  },
  
  // Queue
  {
    id: "queue-js",
    name: "Queue Implementation",
    description: "Queue data structure",
    category: "Stacks & Queues",
    language: "javascript",
    code: `class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    if (this.isEmpty()) return "Queue is empty";
    return this.items.shift();
  }
  
  front() {
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  print() {
    console.log(this.items);
  }
}

// Example usage
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print();
console.log(queue.dequeue());`,
    tags: ["queue", "data-structure"],
  },
  
  // Hash Table
  {
    id: "hash-table-js",
    name: "Hash Table",
    description: "Hash table implementation",
    category: "Hash Tables",
    language: "javascript",
    code: `class HashTable {
  constructor(size = 10) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  
  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  
  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    const existing = bucket.find(item => item[0] === key);
    if (existing) {
      existing[1] = value;
    } else {
      bucket.push([key, value]);
    }
  }
  
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const item = bucket.find(item => item[0] === key);
    return item ? item[1] : undefined;
  }
  
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const itemIndex = bucket.findIndex(item => item[0] === key);
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
    }
  }
}

// Example usage
const hashTable = new HashTable();
hashTable.set("name", "John");
hashTable.set("age", 30);
console.log(hashTable.get("name"));`,
    tags: ["hash-table", "data-structure"],
  },
];

// Get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  return builtInTemplates.filter(t => t.category === category);
};

// Get templates by language
export const getTemplatesByLanguage = (language: string): Template[] => {
  return builtInTemplates.filter(t => t.language === language);
};

// Get templates by search term
export const searchTemplates = (searchTerm: string): Template[] => {
  const term = searchTerm.toLowerCase();
  return builtInTemplates.filter(t =>
    t.name.toLowerCase().includes(term) ||
    t.description.toLowerCase().includes(term) ||
    t.tags.some(tag => tag.toLowerCase().includes(term))
  );
};


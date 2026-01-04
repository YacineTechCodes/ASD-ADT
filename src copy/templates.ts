import type { ADT } from './types';

export const TEMPLATES: Record<string, ADT> = {
    stack: {
        name: 'Stack',
        domain: 'A LIFO (Last-In, First-Out) sequence of elements.',
        uses: 'Function calls, undo mechanisms, parsing expressions.',
        profiles: [
            {
                id: 'op-push',
                name: 'push',
                signature: 'push(s: Stack, x: Item) -> void',
                description: 'Adds an element x to the top of the stack s.',
                preconditions: ['!full(s)'],
            },
            {
                id: 'op-pop',
                name: 'pop',
                signature: 'pop(s: Stack) -> void',
                description: 'Removes the top element from the stack s.',
                preconditions: ['!empty(s)'],
            },
            {
                id: 'op-top',
                name: 'top',
                signature: 'top(s: Stack) -> Item',
                description: 'Returns the top element of the stack s without removing it.',
                preconditions: ['!empty(s)'],
            },
            {
                id: 'op-empty',
                name: 'empty',
                signature: 'empty(s: Stack) -> Boolean',
                description: 'Returns true if the stack s contains no elements.',
            },
        ],
        axioms: [
            { id: 'ax-1', expression: 'empty(new()) = true', relatedProfileIds: ['op-empty'] },
            { id: 'ax-2', expression: 'empty(push(s, x)) = false', relatedProfileIds: ['op-empty', 'op-push'] },
            { id: 'ax-3', expression: 'top(push(s, x)) = x', relatedProfileIds: ['op-top', 'op-push'] },
            { id: 'ax-4', expression: 'pop(push(s, x)) = s', relatedProfileIds: ['op-pop', 'op-push'] },
        ],
        implementations: {
            contiguous: {
                id: 'impl-contiguous',
                name: 'Contiguous',
                domainSpace: `// Array-based implementation
struct Stack {
    items: Array[MAX_SIZE]
    top_index: int
}`,
                methods: {
                    'op-push': `procedure push(s, x):
    if s.top_index == MAX_SIZE - 1:
        error "Stack Overflow"
    s.top_index = s.top_index + 1
    s.items[s.top_index] = x`,
                    'op-pop': `procedure pop(s):
    if s.top_index == -1:
        error "Stack Underflow"
    s.top_index = s.top_index - 1`,
                    'op-top': `procedure top(s):
    if s.top_index == -1:
        error "Stack Underflow"
    return s.items[s.top_index]`,
                    'op-empty': `procedure empty(s):
    return s.top_index == -1`
                }
            },
            chained: {
                id: 'impl-chained',
                name: 'Chained',
                domainSpace: `// Linked-list implementation
struct Node {
    data: Item
    next: Node
}
struct Stack {
    top_node: Node
}`,
                methods: {
                    'op-push': `procedure push(s, x):
    new_node = new Node()
    new_node.data = x
    new_node.next = s.top_node
    s.top_node = new_node`,
                    'op-pop': `procedure pop(s):
    if s.top_node == null:
        error "Stack Underflow"
    s.top_node = s.top_node.next`,
                    'op-top': `procedure top(s):
    if s.top_node == null:
        error "Stack Underflow"
    return s.top_node.data`,
                    'op-empty': `procedure empty(s):
    return s.top_node == null`
                }
            },
        },
    },
    queue: {
        name: 'Queue',
        domain: 'A FIFO (First-In, First-Out) sequence of elements.',
        uses: 'Job scheduling, breadth-first search, buffering.',
        profiles: [
            {
                id: 'op-enqueue',
                name: 'enqueue',
                signature: 'enqueue(q: Queue, x: Item) -> void',
                description: 'Adds an element x to the back of the queue q.',
                preconditions: ['!full(q)'],
            },
            {
                id: 'op-dequeue',
                name: 'dequeue',
                signature: 'dequeue(q: Queue) -> void',
                description: 'Removes the front element from the queue q.',
                preconditions: ['!empty(q)'],
            },
            {
                id: 'op-front',
                name: 'front',
                signature: 'front(q: Queue) -> Item',
                description: 'Returns the front element of the queue q without removing it.',
                preconditions: ['!empty(q)'],
            },
        ],
        axioms: [
            { id: 'ax-1', expression: 'empty(new()) = true', relatedProfileIds: [] },
            { id: 'ax-2', expression: 'front(enqueue(new(), x)) = x', relatedProfileIds: ['op-front', 'op-enqueue'] },
            { id: 'ax-3', expression: 'front(enqueue(enqueue(q, x), y)) = front(enqueue(q, x))', relatedProfileIds: ['op-front', 'op-enqueue'] },
        ],
        implementations: {
            contiguous: {
                id: 'impl-contiguous',
                name: 'Contiguous',
                domainSpace: `// Circular array implementation
struct Queue {
    items: Array[MAX_SIZE]
    head: int
    tail: int
    count: int
}`,
                methods: {
                    'op-enqueue': `procedure enqueue(q, x):
    if q.count == MAX_SIZE:
        error "Queue Overflow"
    q.items[q.tail] = x
    q.tail = (q.tail + 1) % MAX_SIZE
    q.count = q.count + 1`,
                    'op-dequeue': `procedure dequeue(q):
    if q.count == 0:
        error "Queue Underflow"
    q.head = (q.head + 1) % MAX_SIZE
    q.count = q.count - 1`,
                    'op-front': `procedure front(q):
    if q.count == 0:
        error "Queue Underflow"
    return q.items[q.head]`
                }
            },
            chained: {
                id: 'impl-chained',
                name: 'Chained',
                domainSpace: `// Linked list implementation
struct Node {
    data: Item
    next: Node
}
struct Queue {
    head: Node
    tail: Node
}`,
                methods: {
                    'op-enqueue': `procedure enqueue(q, x):
    new_node = new Node()
    new_node.data = x
    if q.tail != null:
        q.tail.next = new_node
    q.tail = new_node
    if q.head == null:
        q.head = new_node`,
                    'op-dequeue': `procedure dequeue(q):
    if q.head == null:
        error "Queue Underflow"
    q.head = q.head.next
    if q.head == null:
        q.tail = null`,
                    'op-front': `procedure front(q):
    if q.head == null:
        error "Queue Underflow"
    return q.head.data`
                }
            },
        },
    },
};

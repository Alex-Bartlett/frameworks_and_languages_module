# Technical Report

(intro describing purpose of report - 200ish words)

_incomplete_

## Critique of Server/Client prototype

### Overview

() -- This needs text

### Not scalable

```py
from .views import get_index, get_item, post_item, delete_item, get_items
ROUTES = (
    ('OPTIONS', r'.*', options_response),
    ('GET', r'/$', get_index),
    ('POST', r'/item$', post_item),
    ('GET', r'/item/(?P<id>\d+)$', get_item),
    ('DELETE', r'/item/(?P<id>\d+)$', delete_item),
    ('GET', r'/items$', get_items),
)
```

The route definitions, for example, are not scalable. Every function must be imported, and routes manually assigned.
As the API grows, this section will too, affecting readability. Also, each function has to be typed out twice: in the import, and in `ROUTES`. This increases the opportunity for human error.

### Code separation

```javascript
const pp = document.createElement("p");
pp.textContent =
	"Missing `?api=` in query string - this is probably not going to work";
pp.style = "color: red";
document.body.appendChild(pp);
```

Elements are added later via DOM manipulation. This impacts readability, as the html file does not represent the true structure of the page. As the project grows
and more elements are added this way, it will get increasingly harder to find where elements are originating from, affecting debugging and overall development time.

### Recommendation

Without the use of frameworks, as is the case for the existing implementation, techniques to improve the readability of the code (e.g. inline javascript) are unavailable,
thus making it harder to maintain. Alongside this, the current implementation takes manual approaches to techniques that are centric to many frameworks, such as
routing. Whilst innovation is important, it's not always necessary to 'reinvent the wheel', and development time could be spent elsewhere rather than designing
solutions to already solved problems. Frameworks supply features that solve common problems, and often introduce/encourage structure, improving scalability and
readability (leading to improved maintainability).

## Server Framework Features

### Hooks

Fastify's hooks allow you to run tasks upon specific events, such as `preParsing` or `onError`.
They provide a modular and more performant alternative to middleware, and run in the order of the internal lifecycle.
Hooks are provided for the application too, such as `onReady` and `preClose`.

```javascript
fastify.addHook("preParsing", (request, reply, payload, done) => {
	let newPayload = payload
	// ...some code (request validation, authorization, etc.)

	// Continue the lifecycle with the new modified payload
	done(null, newPayload);
});
```

With hooks, you can intercept data at different stages of the lifecycle. This allows you to do things
such as validate requests or check authorization in one place. This prevents repetition for things
like authorization in every request handler method and provides a structure, improving readability and maintainability.

- https://fastify.dev/docs/latest/Reference/Hooks
- https://fastify.dev/docs/latest/Reference/Lifecycle/
- https://blog.appsignal.com/2023/05/24/advanced-fastify-hooks-middleware-and-decorators.html
- https://progressivecoder.com/how-to-use-fastify-prehandler-hook/

### Encapsulation

Fastify is designed to be modular, with specific functionality being provided by plugins. As part
of this, it supports encapsulation. This allows for functionality to be context-specific, providing
encapsulated routes access to only the plugins they need. This is demonstrated below.

```javascript
// Root context
const fastify = require('fastify')()
// All contexts have access to this plugin
fastify.register(require('global-plugin'))

// Child context
fastify.register(async function childContext (childServer)) {
	// Only this context has access to 'authentication-plugin'
	childServer.register(require('authentication-plugin'));
	// Add routes that require authentication
}
// Another child context
fastify.register(async function anotherChildContext (anotherChildServer)) {
	childServer.register(require('inherited-plugin'))
	// Grandchild context - encapsulated within anotherChildContext
	anotherChildContext.register(async function grandchildContext (grandchildServer)) {
		// Has access to 'inherited-plugin'
	}
}
```

Encapsulation prevents bloat for routes that do not require certain functionality. For example, routes that
require authentication can have hooks/plugins within their context in which their requests pass through.
Meanwhile, non-authenticated routes can be placed outside of this context so they don't run through these checks.
This reduces processing time, notably as the project scales, improving the server response time.

- https://fastify.dev/docs/latest/Reference/Encapsulation
- https://progressivecoder.com/fastify-plugin-system-encapsulation/

### Schemas & Validation

Fastify's native schema validation allows for convenenient definition of JSON schemas for request bodies,
including defining required values, preventing the need to write complicated validation manually. It employs Ajv JSON validator for this, which validates the data and coecerces it into the expected types.

```javascript
fastify.addSchema({
	$id: "person",
	type: "object",
	properties: {
		name: { type: "string" },
		age: { type: "number" },
	},
});

fastify.post("/", {
	handler() {},
	schema: {
		body: { $ref: "person#" },
	},
});
```

This solves the need for creating data validation methods on each route that expects a body, since the validation can take place within the schema. It also returns the data in the expected type, reducing opportunity for malformed requests to cause errors with type-specific operations.

- https://www.inkoop.io/blog/express-vs-fastify-in-depth-comparison-of-node-js-frameworks/
- https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/
- https://www.npmjs.com/package/ajv
- https://ajv.js.org/coercion.html

## Server Language Features

### Asynchronous Code Execution

With the Node.js runtime, cumbersome tasks that may block the single thread that JavaScript executes upon
can utilise concepts such as async/await to run on another thread. These tasks are handled by the libuv api, which processes them and stores the callback within the event queue (Hu, 2022). Once the callstack for the JavaScript thread is empty, the event loop will pick up the the callback and add it to the callstack to be executed.

```javascript
let x = 1;
// Takes 1 second to resolve (simulating api request)
function SlowMethod() {
	return new Promise(
		(resolve) =>
			setTimeout(() => {
				x++; // Simulating changing data
				resolve();
			}),
		1000
	);
}
// API get method
async function GET() {
	await SlowMethod(); // Slow method will be handled by libuv and run in another thread
	// Flow will continue from here once SlowMethod is complete and callstack is empty
	console.log(x);
}

GET(); // Outputs 2
GET(); // Outputs 3
console.log(x); // Outputs 1 - GET functions are still executing, but they do not block the thread

/**
 * Output:
 * 1
 * 2
 * 3
 */
```

This prevents the delay in execution caused by methods that call external APIs, such as database queries, which would otherwise block the single thread until complete. This way, the server remains responsive during these methods, allowing it to accept simultaneous api requests, and respond to them in the order they are recieved. The above code snippet demonstrates this behaviour.

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
- https://dev.to/nodedoctors/an-animated-guide-to-nodejs-event-loop-3g62

### Mutability Control

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

Variables in JavaScript have their mutability manually assigned at definition, using the `const` or `let` keywords. Constant variables' values are immutable and an error will be raised if an attempt to change them is made. The latter, declared by `let`, are mutable.

```javascript
const x = 1; // Immutable
let y = 1; // Mutable

console.log(++y); // Outputs 2
console.log(++x); // Throws TypeError: Assignment to constant variable
```

Since immutable values cannot change, they help build more predictable and easy to debug code, whereas mutable values can be necessary for the code's function. Both have their place in making code more readable, and supporting both makes the language suitable for a wider range of projects.

- https://www.nickmccullum.com/python-vs-javascript/#9-modules-and-libraries
- https://www.freecodecamp.org/news/mutability-vs-immutability-in-javascript/

## Client Framework Features

### Components

- [Svelte vs Vue](https://blog.openreplay.com/svelte-vs-bue--a-comparison/)
- [No use of virtual DOM](https://svelte.dev/blog/virtual-dom-is-pure-overhead)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

Components are custom UI elements that contain their own markup, run their own logic, and have their own styling (Svelte.dev, n.d.). Properties allow data to be shared with components, which can be accessed via the component's `<script>` tag.

```html
<!-- ExampleComponent.svelte -->
<script>
	// Define component property
	export let value;
</script>

<!--  -->
<p>Value: {value}</p>
```
```html
<!-- +page.svelte -->
<script>
	// Import the component to use it
	import ExampleComponent from ExampleComponent.svelte;
</script>

<ExampleComponent value="10" />
<!-- Compiles to: <p>Value: 10</p> -->
```

The framework makes these reusable elements easy to make, significantly reducing code repitition and improving code readability. The modular nature of components also allow easier debugging and maintenance since all logic and markup is in one file.

- https://svelte.dev/docs/svelte-components

### Logic blocks

Svelte provides `if`, `each`, `await`, and `key` logic blocks to perform logical operations in the page markup, which HTML alone does not support. `if` allows for conditions, `each` allows for iteration, `await` allows for conditionals for promise states (Carvajal, 2022), and `key` recreates components upon variable changes (Svelte.dev, n.d.). Unlike other frameworks like React that use embedded JavaScript for logic, Svelte compiles the template into "highly optimized JavaScript" (Codingballad, 2023) to reduce the amount of runtime work in for the browser.

```html
<script>
	let x = true;
	const list = ["a", "b", "c"];
</script>

{#if x === true}
	<ul>
		{#each list as item}
			<li>{item}</li>
		{/each}
	</ul>
{:else}
	<p>false</p>
{/if}

<!-- Compiles to:
<ul>
	<li>a</li>
	<li>b</li>
	<li>c</li>
</ul>
-->
```

Logic blocks solve multiple problems:

- `if` improves readability by enabling conditions within the page markup, instead of being hidden in scripts.
- `each` prevents code repetition where elements can be programatically created.

All of the logic blocks reduce the code footprint, giving developers more time to focus on the website's purpose rather than it's functionality.

- https://dev.to/codingmustache/svelte-logic-blocks-18ec#chapter-5
- https://svelte.dev/docs/logic-blocks#key

### Reactivity

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)



## Client Language Features

### DOM Manipulation

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

### Arrow Functions

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

## Conclusions

(justify why frameworks are recommended - 120ish words)
(justify which frameworks should be used and why 180ish words)

**TODO:**

- Add permalinks to first section
- In-text citations and harvard referencing

**QUESTIONS:**

- Can I cite documentation such as mdn docs

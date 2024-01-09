# Technical Report

This report examines the challenges in not using a framework for a web API server and its front-end. Analysing an existing implementation without the use of frameworks, the report looks into the challenges of scalability, readability, and overall maintainability that come with this approach. Subsequent recommendations are provided with demonstrations on how they can solve the issues outlined, and other benefits.

Following a new implementation of the example server/client prototype using frameworks, the report explores the features of those used. Fastify, a modern Node.js server framework built for high performance, is used to implement the API. Meanwhile Svelte, a client framework designed for writing minimal yet efficient code, is used for the front-end. These framework offers features that can significantly improve the maintainability of a project as opposed to a framework-less approach.

## Critique of Server/Client prototype

### Overview

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

[Permalink](https://github.com/Alex-Bartlett/frameworks_and_languages_module/blob/b86f4df653896fcc3d77f8e95909409d9c780e53/example_server/app/server.py#L8)

The route definitions, for example, are not scalable. Every function must be imported, and routes manually assigned. As the API grows, this section will too, affecting readability. Also, each function has to be typed out twice: in the import, and in `ROUTES`. This increases the opportunity for human error.

### Code separation

```javascript
const pp = document.createElement("p");
pp.textContent =
	"Missing `?api=` in query string - this is probably not going to work";
pp.style = "color: red";
document.body.appendChild(pp);
```

[Permalink](https://github.com/Alex-Bartlett/frameworks_and_languages_module/blob/b86f4df653896fcc3d77f8e95909409d9c780e53/example_client/index.html#L255)

Elements are added later via DOM manipulation. This impacts readability, as the html file does not represent the true structure of the page. As the project grows and more elements are added this way, it will become increasingly difficult to find where elements are originating from, affecting debugging and overall development time.

### Recommendation

Without frameworks, techniques to improve code readability (e.g. inline javascript) are unavailable, thus making it harder to maintain. Alongside this, the current implementation takes manual approaches to techniques that are centric to many frameworks, such as routing. Whilst innovation is important, it's not always necessary to 'reinvent the wheel', and development time could be spent elsewhere rather than designing solutions to already solved problems. Frameworks supply features that solve common problems, and often introduce/encourage structure, improving scalability and readability (leading to improved maintainability).

## Server Framework Features

### Hooks

Fastify's hooks allow you to run tasks upon specific events, such as `preParsing` or `onError`.
They provide a modular and more performant alternative to middleware (Olatunji, 2023), and run in the order of the internal lifecycle (Fastify, n.d.).
Application hooks also exist, such as `onReady` and `preClose`.

```javascript
fastify.addHook("preParsing", (request, reply, payload, done) => {
	let newPayload = payload;
	// ...some code (request validation, authorization, etc.)

	// Continue the lifecycle with the new modified payload
	done(null, newPayload);
});
```

With hooks, you can intercept data at different stages of the lifecycle, making it "scalable for growing applications" (Dashora, 2022). This allows for things such as validating requests and checking authorization in one place. This prevents repetition for things like authorization in every request handler method and provides a structure, improving readability and maintainability.

#### References

- Dashora, S. (2022). How to use Fastify PreHandler Hook. [online] Progressive Coder. Available at: https://progressivecoder.com/how-to-use-fastify-prehandler-hook/ [Accessed 10 Dec. 2023].

- Fastify (n.d.). Hooks | Fastify. [online] fastify.dev. Available at: https://fastify.dev/docs/latest/Reference/Hooks/ [Accessed 10 Dec. 2023].

- Olatunji, D. (2023). Advanced Fastify: Hooks, Middleware, and Decorators. [online] AppSignal Blog. Available at: https://blog.appsignal.com/2023/05/24/advanced-fastify-hooks-middleware-and-decorators.html [Accessed 10 Dec. 2023].

### Encapsulation

Fastify is designed for modularity, using plugins to "extend its functionalities" (Dashora, 2022). As part
of this, it supports encapsulation. This allows for context-specific functionality, providing
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
	anotherChildServer.register(async function grandchildContext (grandchildServer)) {
		// Has access to 'inherited-plugin'
	}
}
```

Encapsulation prevents bloat for routes that do not require certain functionality. For example, routes that
require authentication can have hooks/plugins within their context in which their requests pass through (Fastify, n.d.).
Meanwhile, non-authenticated routes can be placed outside of this context so they don't run through these checks.
This reduces processing time, particularly as the project scales, improving the server response time.

#### References

- Dashora, S. (2022). Understanding Encapsulation in the Fastify Plugin System. [online] Progressive Coder. Available at: https://progressivecoder.com/fastify-plugin-system-encapsulation/ [Accessed 10 Dec. 2023].

- Fastify (n.d.). Encapsulation | Fastify. [online] fastify.dev. Available at: https://fastify.dev/docs/latest/Reference/Encapsulation/ [Accessed 10 Dec. 2023].

### Schemas & Validation

Fastify's schema validation allows for JSON schema definitions for request bodies, including defining required values, preventing the need to write complicated validation manually. It employs Ajv JSON validator for this (Fastify, n.d.), which validates the data and coecerces it into the expected types (AJV JSON Schema Validator, n.d.).

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

This solves the need for creating data validation methods on each route that expects a body, since the validation can take place within the schema. By returning the data in the expected type, it reduces opportunity for malformed requests to cause errors with type-specific operations. It also improves performance by "offloading validation and serialization to the framework" (Nirnejak, 2023).

#### References

- AJV JSON Schema Validator (n.d.). Ajv JSON Schema Validator. [online] ajv.js.org. Available at: https://ajv.js.org/coercion.html [Accessed 10 Dec. 2023].

- Fastify (n.d.). Validation-and-Serialization | Fastify. [online] fastify.dev. Available at: https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/ [Accessed 10 Dec. 2023].

- Nirnejak, J. (2023). Express.js vs Fastify - In-Depth Comparison of the Frameworks. [online] www.inkoop.io. Available at: https://www.inkoop.io/blog/express-vs-fastify-in-depth-comparison-of-node-js-frameworks/ [Accessed 10 Dec. 2023].

## Server Language Features

### Asynchronous Code Execution

With the Node.js runtime, tasks that may block JavaScript's single thread can utilise concepts such as async/await to run on another thread. These tasks are handled by the libuv api, which processes them and stores the callback within the event queue (Hu, 2022). Once the callstack for the JavaScript thread is empty, the event loop will pick up the the callback and add it to the call stack to be executed (Devero, 2020).

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

/* Output:
	1
 	2
 	3
*/
```

This prevents the delay in execution caused by methods that call external APIs, such as database queries, which would otherwise block the single thread until complete. This way, the server remains responsive during these methods, allowing it to accept simultaneous api requests, and respond to them in the order they are recieved. The above code snippet demonstrates this behaviour.

#### References

- Devero, A. (2020). The JavaScript Event Loop Explained. [online] Alex Devero Blog. Available at: https://blog.alexdevero.com/javascript-event-loop/ [Accessed 9 Jan. 2024].
- Hu, A. (2022). Node.js animated: Event Loop. [online] DEV Community. Available at: https://dev.to/nodedoctors/an-animated-guide-to-nodejs-event-loop-3g62 [Accessed 10 Dec. 2023].

### Mutability Control

Variables in JavaScript have their mutability manually assigned at definition, using the `const` or `let` keywords (McCullum, 2020). Constant variables' values are immutable and an error will be raised if an attempt to change them is made. The latter, declared by `let`, are mutable.

```javascript
const x = 1; // Immutable
let y = 1; // Mutable

console.log(++y); // Outputs 2
console.log(++x); // Throws TypeError: Assignment to constant variable
```

Since immutable values cannot change, they help build more predictable and easy to debug code by being able to "trace how and where data is changing" (Macdonald, 2021), whereas mutable values can be necessary for the code's function. Both have their place in making code more readable, and supporting both makes the language suitable for a wider range of projects. An issue with JavaScript's immutability is that objects' properties remain mutable, despite being defined by `const` (Nwankwo, 2023), although the `Object.freeze` can be used to prevent this.

#### References

- Macdonald, M. (2021). Immutable Vs mutable: Definitions, Benefits & Practical Tips. [online] Blog by Tiny. Available at: https://www.tiny.cloud/blog/mutable-vs-immutable-javascript/ [Accessed 9 Jan. 2024].
- McCullum, N. (2020). Python vs. JavaScript: The 11 Major Differences. [online] www.nickmccullum.com. Available at: https://www.nickmccullum.com/python-vs-javascript/#6-mutability [Accessed 9 Jan. 2024].
- Nwankwo, C. (2023). Mutability vs Immutability in JavaScript – Explained with Code Examples. [online] freeCodeCamp.org. Available at: https://www.freecodecamp.org/news/mutability-vs-immutability-in-javascript/#constimmutability [Accessed 9 Jan. 2024].

## Client Framework Features

### Components

Components are custom UI elements that contain their own markup, run their own logic, and have their own styling (Svelte.dev, n.d.). Properties allow data to be shared with components, which can be accessed via the component's `<script>` tag.

```html
<!-- ExampleComponent.svelte -->
<script>
	// Define component property
	export let value;
</script>

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

The framework makes these reusable elements easy to make, significantly reducing code repetition and improving code readability. The modular nature of components also allow easier debugging and maintenance since all logic and markup is in one file.

#### References

- Svelte.dev (n.d.). Svelte components • Docs • Svelte. [online] svelte.dev. Available at: https://svelte.dev/docs/svelte-components [Accessed 3 Jan. 2024].

### Logic blocks

Svelte provides four different logic blocks to perform logical operations in the page markup, which HTML alone does not support. `if` allows for conditions, `each` allows for iteration, `await` allows for conditionals for promise states (Carvajal, 2022), and `key` recreates components upon variable changes (Svelte.dev, n.d.). Unlike other frameworks like React that use embedded JavaScript for logic, Svelte compiles the template into "highly optimized JavaScript" (Codingballad, 2023) to reduce the amount of runtime work in for the browser.

```svelte
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

#### References

- Carvajal, J. (2022). Svelte Logic Blocks. [online] DEV Community. Available at: https://dev.to/codingmustache/svelte-logic-blocks-18ec [Accessed 7 Jan. 2024].
- Codingballad (2023). Svelte Logic Block 101. [online] Medium. Available at: https://blog.stackademic.com/svelte-logic-block-101-bb1eb49ecf56 [Accessed 8 Jan. 2024].
- Svelte.dev (n.d.). Logic blocks • Docs • Svelte. [online] svelte.dev. Available at: https://svelte.dev/docs/logic-blocks#await [Accessed 7 Jan. 2024].

### Reactivity

Reactivity allows for dynamic element values. Unlike most other frameworks that implement reactivity, data changes do not need to be declared (Okeh, 2019). Instead, when compiling .svelte files into JavaScript, Svelte gives mutable variables "update events" (Klepov, 2023). Assignments to these reactive variables call these events, in turn updating the DOM elements that reference them. Svelte also provides reactive statements (declared with `$:`) that run when reactive variables are changed.

```html
<script>
	// Mutable, thus reactive variable
	let x = false;

	function toggle() {
		// Assignment operation compiles to a call to the variable's update event.
		x = !x;
	}
</script>

<p>X = {x}</p>
<button on:click="{toggle}">Toggle</button>

<!-- Renders to:
<p>X = false</>

When the button is clicked, the DOM updates to:
<p>X = true</>
-->
```

The significantly smaller code footprint that reactivity brings reduces development time, particularly for applications that deal with data and user interaction. Removing the need to declare data changes contributes to this. The amount of boilerplate that a developer has to write to implement automatic DOM updates in Svelte is next to none, giving more time to focus on the features themselves. In larger projects, due to reactive statement's dependencies needing to be explicit (Hagoel, 2021), workarounds may be necessary for these statements to work as intended.

#### References

- Klepov, V. (2023). Svelte Reactivity — an inside and out Guide. [online] Vladimir Klepov as a Coder. Available at: https://blog.thoughtspile.tech/2023/04/22/svelte-state/ [Accessed 8 Jan. 2024].
- Okeh, O. (2019). Truly Reactive Programming with Svelte 3.0. [online] LogRocket Blog. Available at: https://blog.logrocket.com/truly-reactive-programming-with-svelte-3-0-321b49b75969/ [Accessed 8 Jan. 2024].
- Hagoel, I. (2021). Svelte Reactivity Gotchas + Solutions. [online] DEV Community. Available at: https://dev.to/isaachagoel/svelte-reactivity-gotchas-solutions-if-you-re-using-svelte-in-production-you-should-read-this-3oj3 [Accessed 9 Jan. 2024].

## Client Language Features

### DOM Manipulation

JavaScript on the browser has direct DOM access through the DOM API (MDN, 2023). This allows JavaScript to manipulate DOM elements, creating, modifying, and deleting them.

```javascript
// Access the DOM with the document property
const newElement = document.createElement("div");
// Add some text to the element
newElement.textContent = "New element";
// Add the element to the document's body
document.body.appendChild(newElement);

/* HTML:
<div>New element</div>
*/
```

"JavaScript is the client-side scripting language that connects to the DOM in an internet browser" (Rascia, 2017), so other languages result to compiling into JavaScript when making client applications. By being able to modify the document directly, this extra compilation step is not necessary, therefore saving development time.

#### References

- MDN (2023). Using the Document Object Model - Web APIs | MDN. [online] developer.mozilla.org. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Using_the_Document_Object_Model#what_does_the_document_api_do [Accessed 8 Jan. 2024].
- Rascia, T. (2017). Introduction to the DOM | DigitalOcean. [online] www.digitalocean.com. Available at: https://www.digitalocean.com/community/tutorials/introduction-to-the-dom [Accessed 8 Jan. 2024].

### Arrow Functions

Arrow functions are a shorthand syntax for declaring anonymous functions. They support implicit returns where the "statement is straightforward" (Arianna, 2022), and explicit returns for multi-line expressions. Arrow functions have "lexical this" (Rascia, 2021), in which they share the `this` scope of the level above themselves.

```javascript
// Implicit return
let sum = (a, b) => a + b;
// Explicit return
sum = (a, b) => {
	return a + b;
};
```

Arrow functions are particularly useful as callback functions and in iterator methods (Arianna, 2022) that require a function parameter due to their shortened syntax. This produces more readable and efficiently typed code, as opposed to declaring named functions for miniscule operations. They do have limitations; they are not suitable for object methods due to their lexical scoping (Rascia, 2021), and their anonymous nature can add complexity to debugging. However, for the reasons mentioned, they can reduce the time it takes a developer to understand how the code works.

#### References

- Arianna, J. (2022). Guide to Arrow Functions in JavaScript. [online] Medium. Available at: https://towardsdev.com/guide-to-arrow-functions-in-javascript-647394230c66 [Accessed 8 Jan. 2024].
- Rascia, T. (2021). Understanding Arrow Functions in JavaScript | DigitalOcean. [online] www.digitalocean.com. Available at: https://www.digitalocean.com/community/tutorials/understanding-arrow-functions-in-javascript.

## Conclusions

Frameworks are tools designed to reduce the amount of code a developer has to write. Whilst a developer is likely capable of creating their own implementations of the features a framework provides, it is not always necessary for every project to do this. Given that frameworks are often open-source, their features are usually very refined and efficient.

Numerous server and client frameworks exist, so choosing the right one for a particular project is a careful process. Once a framework has been implemented, it's not so easy to switch it out for another one later down the line, since their approach to features may differ.

Fastify is a suitable server framework for applications with high concurrent users. Its ability to serve up to 30000 requests per second (Fastify, n.d.) puts its ahead of other popular frameworks like Express for this metric. However, most projects do not see these numbers, and in the case of small projects, it is oftentimes best to use a framework for a language the developer is competent with. The same applies for client frameworks, although an argument can be made that due to JavaScript's native support in all popular browsers, it may be suitable more often than not. Yet, other languages increasingly support WebAssembly (Steiner, 2023), such as with the Blazor framework for C#. In conclusion, frameworks that should be used differ based on the type and scale of project, and also the developer/team that is using it.

#### References

- Fastify (n.d.). Fast and low overhead web framework, for Node.js | Fastify. [online] fastify.dev. Available at: https://fastify.dev/ [Accessed 9 Jan. 2024].
- Steiner, T. (2023). What Is WebAssembly and Where Did It Come from? | Articles. [online] web.dev. Available at: https://web.dev/articles/what-is-webassembly.

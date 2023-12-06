Technical Report
================

(intro describing purpose of report - 200ish words)

*incomplete*

Critique of Server/Client prototype
---------------------

### Overview
()

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

```js
	const pp = document.createElement('p')
	pp.textContent = "Missing `?api=` in query string - this is probably not going to work"
	pp.style = "color: red"
	document.body.appendChild(pp)
```

Elements are added later via DOM manipulation. This impacts readability, as the html file does not represent the true structure of the page. As the project grows
and more elements are added this way, it will get increasingly harder to find where elements are originating from, affecting debugging and overall development time.

### Recommendation

Without the use of frameworks, as is the case for the existing implementation, techniques to improve the readability of the code (e.g. inline javascript) are unavailable,
thus making it harder to maintain. Alongside this, the current implementation takes manual approaches to techniques that are centric to many frameworks, such as
routing. Whilst innovation is important, it's not always necessary to 'reinvent the wheel', and development time could be spent elsewhere rather than designing
solutions to already solved problems. Frameworks supply features that solve common problems, and often introduce/encourage structure, improving scalability and
readability (leading to improved maintainability). 

Server Framework Features
-------------------------

### Hooks

Fastify's hooks allow you to run tasks upon specific events, such as `preParsing` or `onError`.
They provide a modular and more performant alternative to middleware, and run in the order of the internal lifecycle.
Hooks are provided for the application too, such as `onReady` and `preClose`.

```js
fastify.addHook('preParsing', (request, reply, payload, done) => {
  // Some code (request validation, authorization, etc.)
  done(null, newPayload)
})
```

With hooks, you can intercept data at different stages of the lifecycle. This allows you to do things
such as validate requests or check authorization in one place. This prevents repetition for things
like authorization in every request handler method and provides a structure, improving readability and maintainability.

- https://fastify.dev/docs/latest/Reference/Hooks
- https://fastify.dev/docs/latest/Reference/Lifecycle/
- https://blog.appsignal.com/2023/05/24/advanced-fastify-hooks-middleware-and-decorators.html
- https://progressivecoder.com/how-to-use-fastify-prehandler-hook/


### Encapsulation

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

Fastify is designed to be modular, with specific functionality being provided by plugins. As part
of this, it supports encapsulation. This allows for functionality to be context-specific, providing
encapsulated routes access to only the plugins they needs. This is demonstrated below.

```js
// Root context
const fastify = require('fastify')()
// All contexts have access to this plugin
fastify.register(require('global-plugin'))

// Child context
fastify.register(async function childContext (childServer) {
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


### Decorators

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


Server Language Features
-----------------------

### (name of Feature 1)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)



Client Framework Features
-------------------------

### (name of Feature 1)

- [Svelte vs Vue](https://blog.openreplay.com/svelte-vs-bue--a-comparison/)
- [No use of virtual DOM](https://svelte.dev/blog/virtual-dom-is-pure-overhead)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 3)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


Client Language Features
------------------------

### (name of Feature 1)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)



Conclusions
-----------

(justify why frameworks are recommended - 120ish words)
(justify which frameworks should be used and why 180ish words)

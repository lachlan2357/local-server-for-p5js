// @ts-check

/**
 * Retrieve a reference to a DOM element, ensuring it is not null.
 * 
 * This method acts similarly to {@link document.getElementById()} with extra steps.
 * 
 * @template {keyof HTMLElementTagNameMap} K The tag name of the element to fetch.
 * @template {HTMLElementTagNameMap[K]} E The type of the HTML element to return.
 * 
 * @param {string} id The ID to fetch the DOM element by.
 * @param {K} tag_name The tag name of the element type.
 * @returns {E} The DOM element.
 * 
 * @throws {ReferenceError} If the DOM element could not be located.
 * @throws {TypeError} If the tag name of the retrieved DOM element does not match `tag_name`.
 */
function getElement(id, tag_name) {
	const element = document.getElementById(id);
	if (element === null) throw new ReferenceError(`No DOM element with id '${id}'.`);
	
	const retrieved_tag_name = element.tagName.toLowerCase();
	if (retrieved_tag_name !== tag_name) throw new TypeError(`DOM Element has incorrect tag name of '${retrieved_tag_name}' instead of '${tag_name}'.`);

	return /** @type {E} */ (element);
}

/**
 * Navigate to the locally cached page for a sketch.
 * 
 * @param {string} username The sketch author's username.
 * @param {string} sketch_id The sketch ID.
 */
function goToSketch(username, sketch_id) {
	const path = `${username}/sketches/${sketch_id}/index.html`;
	location.pathname = path;
}

// DOM Elements.
const cache_details = getElement("cache-details", "form");
const cache_url = getElement("cache-url", "form");

const username_input = getElement("username", "input");
const sketch_id_input = getElement("sketch-id", "input");
const url_input = getElement("url", "input");

// URL Regex
const regex = /(?:https?:\/\/)editor\.p5js\.org\/([^\/]+)\/(?:sketches|full)\/([^\/]+)/;
const regex_string = regex.toString();
url_input.pattern = regex_string.substring(1, regex_string.length - 1);

cache_details.addEventListener("submit", e => {
	e.preventDefault();

	const data = new FormData(cache_details);
	const username = data.get("username")?.toString();
	const sketch_id = data.get("sketch-id")?.toString();

	if (username === undefined) throw new ReferenceError(`Form has no input named 'username'.`);
	if (sketch_id === undefined) throw new ReferenceError(`Form has no input named 'sketch-id'.`);

	goToSketch(username, sketch_id);
});

cache_url.addEventListener("input", e => {
	if (url_input.value !== "abc") {
	}
});

cache_url.addEventListener("submit", e => {
	e.preventDefault();

	const data = new FormData(cache_url);
	const url = data.get("url")?.toString();

	if (url === undefined) throw new ReferenceError(`Form has no input named 'url'.`);

	const thing = regex.exec(url);
	if (thing === null) throw new EvalError("Regex evaluation on url failed.");

	const username = thing[1];
	const sketch_id = thing[2];
	goToSketch(username, sketch_id);
});

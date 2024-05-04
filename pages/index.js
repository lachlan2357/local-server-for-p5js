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
	const path = getSketchLocalUrl(username, sketch_id);
	location.pathname = path;
}

/**
 * Retrieve the URL to a sketch hosted on `editor.p5js.org`.
 * 
 * @param {string} username The sketch author's username.
 * @param {string} sketch_id The sketch ID.
 * @returns The URL to the hosted sketch.
 */
function getSketchUrl(username, sketch_id) {
	return `https://editor.p5js.org/${username}/sketches/${sketch_id}`;
}

/**
 * Retrieve the URL to a sketch hosted locally.
 * 
 * @param {string} username The sketch author's username.
 * @param {string} sketch_id The sketch ID.
 * @returns The URL to the sketch hosted locally.
 */
function getSketchLocalUrl(username, sketch_id) {
	return `${username}/sketches/${sketch_id}/index.html`;
}

/**
 * Retrieve the URL to an authors page on `editor.p5js.org`.
 * 
 * @param {string} username The sketch author's username.
 * @returns The URL to the hosted author's page.
 */
function getAuthorUrl(username) {
	return `${username}/sketches`;
}

// DOM Elements.
const cache_details = getElement("cache-details", "form");
const cache_url = getElement("cache-url", "form");
const cached_sketches_parent = getElement("cached-sketches", "div");

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

fetch("/all-projects")
	.then(res => res.json())
	.then(json_string => JSON.parse(json_string))
	.then(json => updated_cached_project(json))
	.catch(console.error);

/**
 * Update the list of cached projects on the home page.
 * 
 * @param {{username: string, sketch_id: string, name: string}[]} sketches All cached projects.
 */
function updated_cached_project(sketches) {
	while (cached_sketches_parent.hasChildNodes()) {
		cached_sketches_parent.firstChild?.remove();
	}

	for (const sketch of sketches) {
		const {username, sketch_id, name} = sketch;

		const name_element = document.createElement("h3");
		name_element.classList.add("name");
		name_element.textContent = sketch.name;

		const author_element = document.createElement("a");
		author_element.classList.add("author");
		author_element.href = getAuthorUrl(username);
		author_element.textContent = sketch.username;

		const by_element = document.createElement("p");
		by_element.textContent = "by: ";
		by_element.appendChild(author_element);
		
		const id_element = document.createElement("p");
		id_element.classList.add("id");
		id_element.textContent = sketch.sketch_id;

		const link_element = document.createElement("a");
		link_element.textContent = "View Locally";
		link_element.href = getSketchLocalUrl(username, sketch_id);

		const p5_link_element = document.createElement("a");
		p5_link_element.textContent = "View at editor.p5js.org";
		p5_link_element.href = getSketchUrl(username, sketch_id);

		const info_container = document.createElement("div");
		info_container.classList.add("info");
		info_container.append(name_element, by_element, id_element);

		const link_container = document.createElement("div");
		link_container.classList.add("links");
		link_container.append(link_element, p5_link_element);

		const parent_element = document.createElement("div");
		parent_element.classList.add("cached-sketch");
		parent_element.append(info_container, link_container);

		cached_sketches_parent.appendChild(parent_element);
	}
}
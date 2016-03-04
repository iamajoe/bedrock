// -----------------------------------------
// VARS

// -----------------------------------------
// FUNCTIONS

/**
 * Get closest DOM element up the tree that contains a class, ID, or data attribute
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Node} Null if no match
 */
const getClosest = (el, selector) => {
    const firstChar = selector.charAt(0);

    // Get closest match
    for ( ; el && el !== document; el = el.parentNode) {
        // If selector is a class
        if (firstChar === '.') {
            if (el.classList.contains(selector.substr(1))) {
                return el;
            }
        }

        // If selector is an ID
        if (firstChar === '#') {
            if (el.id === selector.substr(1)) {
                return el;
            }
        }

        // If selector is a data attribute
        if (firstChar === '[') {
            if (el.hasAttribute(selector.substr(1, selector.length - 2))) {
                return el;
            }
        }

        // If selector is a tag
        if (el.tagName.toLowerCase() === selector) {
            return el;
        }
    }
};

// -----------------------------------------
// EXPORT

export { getClosest };

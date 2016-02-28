// -----------------------------------------
// VARS

const FONTAWESOME_SRC = '/_assets/svg/fontawesome.svg';
const FONTAWESOME_INVERSE_SRC = '/_assets/svg/fontawesome-white.svg';

const ICONS = {};
const ICONS_INVERSE = {};

// -----------------------------------------
// FUNCTIONS

/**
 * Adds icon
 * @param  {string} icon
 * @param  {object} options
 * @return {string}
 */
const addIcon = (icon, options = {}) => {
    const size = options.size || 'small';
    const isInverse = options.isInverse;
    let src;
    let tmpl;

    // Get the right icon
    if (isInverse) {
        src = ICONS_INVERSE[icon] || `${FONTAWESOME_INVERSE_SRC}#fa-${icon}`;
    } else {
        src = ICONS[icon] || `${FONTAWESOME_SRC}#fa-${icon}`;
    }

    tmpl = `
    <div class="icon-wrapper">
        <img src="${src}" class="icon icon-${size} icon-${icon}">
    </div>
    `;

    return tmpl;
};

// -----------------------------------------
// EXPORT

export { addIcon };

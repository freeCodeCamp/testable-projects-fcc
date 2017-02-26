import $ from 'jquery';

export function getToolTipStatus(tooltip) {
    // jQuery's :hidden selector checks if the element or its parents have a display of none, a type of hidden, or height/width set to 0
    // if the element is hidden with opacity=0 or visibility=hidden, jQuery's :hidden will return false because it takes up space in the DOM
    // this test combines jQuery's :hidden with tests for opacity and visbility to cover most use cases (z-index and potentially others are not tested)
    if ($(tooltip).is(':hidden') || tooltip.style.opacity === '0' || tooltip.style.visibility === 'hidden') {
        return 'hidden'
    } else {
        return 'visible'
    }
}

export function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

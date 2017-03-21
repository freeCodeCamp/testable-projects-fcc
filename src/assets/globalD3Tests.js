import $ from 'jquery';

function isToolTipHidden(tooltip) {
    // jQuery's :hidden selector checks if the element or its parents have a display of none, a type of hidden, or height/width set to 0
    // if the element is hidden with opacity=0 or visibility=hidden, jQuery's :hidden will return false because it takes up space in the DOM
    // this test combines jQuery's :hidden with tests for opacity and visbility to cover most use cases (z-index and potentially others are not tested)
    return ($(tooltip).is(':hidden') || tooltip.style.opacity === '0' || tooltip.style.visibility === 'hidden')
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

/**
  JQuery's mouseevents don't work for non IE browsers in these tests.  
  This is a workaround to handle IE and non IE mouse events
**/
function triggerMouseEvent(area, mouseEvent){
  var event;
  if(document.createEvent){
     // Internet Explorer
     event = document.createEvent("MouseEvent");
     event.initMouseEvent(mouseEvent,true,true,window,0,0,0,0,0,false,false,false,false,0,null);
  }
  else{
    // Non IE browser
      event = new MouseEvent(mouseEvent);
  }
  area.dispatchEvent(event);
}

/**
  Mouses over random areas to see if a tooltip appears
**/
export function testToolTip(areas, toolTipDataName, areaDataName){

  describe('#TooltipTests', function() {
    it('1. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area ', function(){
      const firstRequestTimeout = 500;
      const secondRequestTimeout = 2000;
      this.timeout(firstRequestTimeout + secondRequestTimeout + 1000);
      FCC_Global.assert.isNotNull(document.getElementById('tooltip'), 'There should be an element with id="tooltip"');

      const tooltip = document.getElementById('tooltip');

      // place mouse on random bar and check if tooltip is visible
      const randomIndex = getRandomIndex(areas.length);
      var randomArea = areas[randomIndex];
      triggerMouseEvent(randomArea, "mouseover");
      triggerMouseEvent(randomArea, "mousemove");
      triggerMouseEvent(randomArea, "mouseenter");

      // promise is used to prevent test from ending prematurely
      return new Promise((resolve, reject) => {
        // timeout is used to accomodate tooltip transitions
        setTimeout( _ => {
          if(isToolTipHidden(tooltip)) {
            reject(new Error('Tooltip should be visible when mouse is on an area'))
          }

          // remove mouse from cell and check if tooltip is hidden again  
          triggerMouseEvent(randomArea, "mouseout");
          setTimeout( _ => {
            if(!isToolTipHidden(tooltip)) {
              reject(new Error('Tooltip should be hidden when mouse is not on an area'))
            } else {
              resolve()
            }
          }, secondRequestTimeout)
        }, firstRequestTimeout)
      })
    })
    it('2. My tooltip should have a "'+toolTipDataName+'" property that corresponds to the "'+ areaDataName + '" of the active area.', function() {
       const tooltip = document.getElementById('tooltip');
       FCC_Global.assert.isNotNull(tooltip.getAttribute(toolTipDataName), 'Could not find property "'+toolTipDataName+'" in tooltip ');
       const randomIndex = getRandomIndex(areas.length);

       var randomArea = areas[randomIndex];
       
       triggerMouseEvent(randomArea, "mouseover");
       triggerMouseEvent(randomArea, "mousemove");
       triggerMouseEvent(randomArea, "mouseenter");
       
       FCC_Global.assert.equal(tooltip.getAttribute(toolTipDataName), randomArea.getAttribute(areaDataName), 'Tooltip\'s \"'+toolTipDataName+'\" property should be equal to the active area\'s \"'+areaDataName+'\" property');
       
       //clear out tooltip
       triggerMouseEvent(randomArea, "mouseout");
    })
  })
};

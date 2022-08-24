//
// JS to Handle Copy Functions from the correct structured data
//
// <div class="output-copy-container">
//   <div class="output-copy blockonomics-input">
//     <input value="MyValue">
//     <span class="copied-text">Copied <img class="blockonomics-icon" src="/img/blockonomics_icons/confirm-circle.png"></span>
//   </div>
//   <img class="blockonomics-icon" src="/img/blockonomics_icons/copy.png" onclick="copyToClipboard(event)">
// </div>
//

// Used to allow copying of code
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Create the copied overlay, Hide the Input
// Uses getBoundingClientRect to create the overlay size
var showCopiedText = function(copy_element) {
  var copy_input = copy_element.querySelector(".output-copy");
  copy_input.style.height = copy_input.getBoundingClientRect().height+'px';
  copy_input.style.width = copy_input.getBoundingClientRect().width+'px';
  var copied_text = copy_element.querySelector(".copied-text");
  copied_text.style.height = copy_input.querySelector("input") ? copy_input.querySelector("input").getBoundingClientRect().height+'px' : copy_input.querySelector(".value").offsetHeight+'px';
  copied_text.style.lineHeight = copy_input.querySelector("input") ? copy_input.querySelector("input").getBoundingClientRect().height+'px' : copy_input.querySelector(".value").offsetHeight+'px';
  // Show copied overlay
  var copy_value = copy_input.querySelector("input") ? copy_input.querySelector("input") : copy_input.querySelector(".value");
  copied_text.querySelector("img").style.height =  '17px';
  copied_text.style.display = "inline-block";
  copy_value.style.display = "none";
  setTimeout(function() {
    // Hide copied overlay
    copied_text.style.display = "none";
    copy_value.style.display = "inline-block";
  }, 3000);
}

// Uses navigator.clipboard.writeText to copy the text
// For input copies the value else copies innerHTML
function copyToClipboard(evt) {
  var copy_element = evt.currentTarget.parentElement;
  var copy_input = copy_element.querySelector(".output-copy");
  var copy_value = copy_element.querySelector('input') ? copy_input.querySelector("input").value : copy_input.querySelector(".value").innerHTML;
  var copy_html = decodeHtml(copy_value);
  navigator.clipboard.writeText(copy_html).then(() => {
      showCopiedText(copy_element);
  });
}


//
// Additional JS for attachment to input fields
// Looks for elements with th data-copy attribute and wraps in the correct structure
// This:
// <input value="MyValue" data-copy>
// Gets transformed to:
// <div class="output-copy-container">
//   <div class="output-copy blockonomics-input">
//     <input value="MyValue" data-copy>
//     <span class="copied-text">Copied <img class="blockonomics-icon" src="/img/blockonomics_icons/confirm-circle.png"></span>
//   </div>
//   <img class="blockonomics-icon" src="/img/blockonomics_icons/copy.png" onclick="copyToClipboard(event)">
// </div>

// Wrap an element in another element
// <wrapper><el></el></wrapper>
function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

// Fetch all elements with the data-copy attribute
const el1 = document.querySelectorAll('[data-copy]');
for (var i = el1.length - 1; i >= 0; i--) {
  // Fetch the original elements styles
  const boxStyles = window.getComputedStyle(el1[i]);
  // Create the 1st div to wrap the element in
  const containerInner = document.createElement('div');
  containerInner.classList.add("output-copy");
  // Apply the original width to the wrap
  containerInner.style.width = boxStyles.width;
  el1[i].style.border = boxStyles.border;
  // Wrap the element in the 1st div
  wrap(el1[i], containerInner);

  //Create the copied span and apply the same styles from the element
  const copied = document.createElement('span');
  copied.style.background = boxStyles.background;
  copied.style.border = boxStyles.border;
  copied.style.borderBottom = boxStyles.borderBottom;
  copied.style.borderTop = boxStyles.borderTop;
  copied.style.borderLeft = boxStyles.borderLeft;
  copied.style.borderRight = boxStyles.borderRight;
  copied.style.outline = boxStyles.outline;
  copied.style.borderRadius = boxStyles.borderRadius;
  copied.style.color = boxStyles.color;
  copied.classList.add("copied-text");
  // confirm-circle icon color
  const icon_color = el1[i].getAttribute('data-icons');
  if (icon_color) {
    const src = "img/blockonomics_icons/confirm-circle-"+icon_color+".png";
    copied.innerHTML = "Copied <img class=\"blockonomics-icon\" src=\""+src+"\">";
    containerInner.appendChild(copied);
  }else {
    const src = "img/blockonomics_icons/confirm-circle.png";
    copied.innerHTML = "Copied <img class=\"blockonomics-icon\" src=\""+src+"\">";
    containerInner.appendChild(copied);
  }

  // Create the 2nd div to wrap the element in
  const containerOuter = document.createElement('div');
  containerOuter.classList.add("output-copy-container");
  // Wrap the element in the 2nd div
  wrap(containerInner, containerOuter);

  // Create the copy icon
  const image = document.createElement('img');
  image.classList.add("blockonomics-icon");

  // copy icon color
  const copy_icon_color= el1[i].getAttribute('data-icons');
  if (copy_icon_color) {
    const src = "img/blockonomics_icons/copy-"+copy_icon_color+".png";
    image.setAttribute(
      'src',
      src,
    );
    image.setAttribute(
      'onclick',
      'copyToClipboard(event)',
    );
    containerOuter.appendChild(image);
  }else {
    const src = "img/blockonomics_icons/copy.png";
    image.setAttribute(
      'src',
      src,
    );
    image.setAttribute(
      'onclick',
      'copyToClipboard(event)',
    );
    containerOuter.appendChild(image);
  }
}
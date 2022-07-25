function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var showCopiedText = function(copy_element) {
  var copy_input = copy_element.querySelector(".output-copy");
  copy_input.style.height = copy_input.getBoundingClientRect().height+'px';
  copy_input.style.width = copy_input.getBoundingClientRect().width+'px';
  var copied_text = copy_element.querySelector(".copied-text");
  copied_text.style.height = copy_input.querySelector("input") ? copy_input.querySelector("input").getBoundingClientRect().height+'px' : copy_input.querySelector(".value").offsetHeight+'px';
  copied_text.style.lineHeight = copy_input.querySelector("input") ? copy_input.querySelector("input").getBoundingClientRect().height+'px' : copy_input.querySelector(".value").offsetHeight+'px';
  var copy_value = copy_input.querySelector("input") ? copy_input.querySelector("input") : copy_input.querySelector(".value");
  copied_text.querySelector("img").style.height =  '17px';
  copied_text.style.display = "inline-block";
  copy_value.style.display = "none";
  setTimeout(function() {
    copied_text.style.display = "none";
    copy_value.style.display = "inline-block";
  }, 3000);
}

function copyToClipboard(evt) {
  var copy_element = evt.currentTarget.parentElement;
  var copy_input = copy_element.querySelector(".output-copy");
  var copy_value = copy_element.querySelector('input') ? copy_input.querySelector("input").value : copy_input.querySelector(".value").innerHTML;
  var copy_html = decodeHtml(copy_value);
  navigator.clipboard.writeText(copy_html).then(() => {
      showCopiedText(copy_element);
  });
}


// Additional JS for attachment to input fields
function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

const el1 = document.querySelectorAll('[data-copy]');
for (var i = el1.length - 1; i >= 0; i--) {
  const boxStyles = window.getComputedStyle(el1[i]);
  const containerInner = document.createElement('div');
  containerInner.classList.add("output-copy");
  containerInner.style.width = boxStyles.width;
  el1[i].style.border = boxStyles.border;
  wrap(el1[i], containerInner);

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

  const containerOuter = document.createElement('div');
  containerOuter.classList.add("output-copy-container");
  wrap(containerInner, containerOuter);

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
# copy-component
Creates a copy element from an existing element using the data-copy attribute. Places a copy icon next to the element. When clicking the icon, the value of the element is copied to the clipboard and a copied overlay is displayed over the element for a short duration. Works with `<input>`, `<textarea>`, `<span>`, and `<div>` elements\
![Component Image](/screenshots/Component_2.png?raw=true "Component")\
![After Copy Image](/screenshots/Component_3.png?raw=true "After Copy")

## Usage instructions
* Copy the `css`, `img`, and `js` folders to your project
* Load the CSS in the header of your html\
`<link rel="stylesheet" href="css/copyToClipboard.css">`
* Load the JS in the foorter of your html\
`<script src="js/copyToClipboard.js"></script>`
* Add the data-copy attribute to your desired elements\
`<input type="text" value="MyValue" data-copy>`

## Icon colors
To change the icons to white, add the *light-icons* attribute to the element\
`<input type="text" value="MyValue" data-copy light-icons>`

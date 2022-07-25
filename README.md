# copy-component
Creates a copy element from existing element using data-copy attribute. Places a copy icon next to the element. When clicking the icon, the value of the element is copied and a copied overlay is displayed over the element for a short duration.\
![Without Component Image](/screenshots/Component_1.png?raw=true "Without Component")\
![With Component Image](/screenshots/Component_2.png?raw=true "With Component")\
![After Copy Image](/screenshots/Component_3.png?raw=true "After Copy")

## Usage instructions
* Copy the component JS, CSS, and Icons to your project
* Load the component CSS in the header of your html
`<link rel="stylesheet" href="css/components.css">`
* Load the component JS in the foorter of your html
`<script src="js/copyToClipboard.js"></script>`
* Add the data-copy attribute to your desired element
`<input type="text" value="MyValue" data-copy>`

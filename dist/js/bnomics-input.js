class BlocknomicsInput {
    constructor(ele) {
        this.ele = ele
        this.init()
    }

    init() {
        this.loadData()
        this.addHelpers()
    }

    loadData() {
        this.data = this.ele.dataset
    }

    determineElementType() {
        this.element_type = this.ele.tagName.toLowerCase()
    }

    addHelpers() {

        this.ele.classList.add(this.getTheme())

        this.determineElementType()

        if (this.element_type == 'div') this._addDivHelpers()
        else if (this.element_type == 'textarea') this._addTextAreaHelpers()
    }

    _addDivHelpers() {
        let content = document.createElement('div')
        content.classList.add('bnomics-input--content')

        let content_text = document.createElement('div')
        content_text.classList.add('bnomics-input--content--text')
        content_text.innerHTML = this.ele.innerHTML
        
        content.appendChild(content_text)

        // Copied Overlay
        let overlay = this._createOverlayElement()
        content.appendChild(overlay)

        this.ele.innerHTML = ""
        this.ele.appendChild(content)

        // Copy Button
        let copy_button = this._createCopyButtonElement()
        this.ele.appendChild(copy_button)

        copy_button.addEventListener('click', (e) => this.handleCopy(e))
        
        this.copy_button = copy_button
        this.overlay = overlay
        this.content_container = content_text

        this.ele.classList.add('has-copy')
    }

    _addTextAreaHelpers() {
        /**
         * Textarea Approach Works by adding a Padding to TextArea and attaching WindowResize Events to it
         * A Copied Element is created over the textarea element for brief amount and then removed
         */
        this.ele.setAttribute('readonly', 'true')
        this.ele.setAttribute('rows', 1)

        // Fix for Textarea whitespacing
        this.ele.innerHTML = this.ele.innerHTML.trim()

        // Auto Height Adjust
        this._autoAdjustElementHeight()

        // window.addEventListener('resize', () => this._autoAdjustElementHeight())
        
        // Copy Button
        let copy_button = this._createCopyButtonElement()
        copy_button.classList.add('floating')
        this._repositionCopyButton(copy_button)
        this._autoAdjustCopyButtonHeight(copy_button)
        document.body.appendChild(copy_button)
        
        // Add Class to adjust paddings
        this.ele.classList.add('has-copy')
        
        // Add DOM Observer to reposition when other elements move
        // window.addEventListener('resize', () => this._autoAdjustCopyButtonHeight(copy_button))
        window.addEventListener('resize', () => {
            console.log('resize')
            this._autoAdjustElementHeight()
            this._autoAdjustCopyButtonHeight(copy_button)
            this._repositionCopyButton(copy_button)
        })

        new MutationObserver(() => this._repositionCopyButton(copy_button)).observe(document.body, { attributes: true, childList: true, subtree: true });

        copy_button.addEventListener('click', (e) => this.handleCopy(e))
        
        this.copy_button = copy_button
    }

    _autoAdjustElementHeight() {
        this.ele.style.height = this.ele.scrollHeight + "px"
    }
    
    _autoAdjustCopyButtonHeight(copy_button) {
        copy_button.style.height = this.ele.scrollHeight + "px"
    }

    _repositionCopyButton(ele) {
        // const element_bounds = this._getElementBounds()
        // console.log(element_bounds)
        
        ele.style.top = this.ele.offsetTop + 'px'
        ele.style.left = (this.ele.offsetLeft + this.ele.offsetWidth) + 'px'
    }

    _getElementBounds() {
        // const bounds = this.ele.getBoundingClientRect()
        const topOffset = this.ele.offsetTop
        const leftOffset = this.ele.offsetLeft
        const height = this.ele.offsetHeight
        const width = this.ele.offsetWidth

        return {
            x1: leftOffset,
            y1: topOffset,
            x2: leftOffset + width, // Top Right
            y2: topOffset,                // Top Right
            x3: leftOffset,                // Bottom Left
            y3: topOffset + height,//Bottom Left
            x4: leftOffset + width, // Bottom Right
            y4: topOffset + height,//Bottom Right
        }
    }

    _createOverlayElement() {
        let overlay = document.createElement('span')
        overlay.classList.add('bnomics-input--overlay')
        overlay.innerHTML = "Copied"
        
        let overlay_icon = document.createElement('img')
        overlay_icon.setAttribute('src', this.getCheckImage())
        overlay.appendChild(overlay_icon)

        return overlay
    }

    _createCopyButtonElement() {
        let copy_button = document.createElement('a')
        copy_button.setAttribute('href', '#')
        copy_button.classList.add('bnomics-input--copy')

        let icon = document.createElement('img')
        icon.setAttribute('src', this.getCopyImage())
        copy_button.appendChild(icon)

        return copy_button
    }

    _createAndAddOverlay(visible=false) {
        /**
         * Why promise?
         * 
         * To simulate the fadeIn behavior when visible is set to true.
         * 
         * The element is first added to the DOM, and then after 100ms the class visible
         * is added to it, which makes the CSS Transition smooth!
         * 
         */
        return new Promise((resolve) => {
            if (this.element_type != 'textarea') return
    
            let overlay = this._createOverlayElement()
            overlay.classList.add('floating')
    
            const bounds = this._getElementBounds()
    
            overlay.style.left = bounds.x1 + 'px'
            overlay.style.top = bounds.y1 + 'px'
    
            overlay.style.height = (bounds.y4 - bounds.y2) + 'px'
            overlay.style.width = (bounds.x2 - bounds.x1) + 'px'
    
            document.body.appendChild(overlay)
    
            this.overlay = overlay
            if (visible) {
                setTimeout(() => {
                    overlay.classList.add('visible')
                    resolve()
                }, 100)
            } else {
                resolve()
            }
        })
    }

    async handleCopy(e) {
        e.preventDefault()
        try {
            let content = this.data.copy
            
            if (!content || content.length == 0) {
                if (this.element_type == 'div')
                    content = this.content_container.innerText
                else if (this.element_type == 'textarea')
                    content = this.ele.innerHTML.trim()
            }

            await this.copyToClipboard(content)
            this.showOverlay()
        } catch(e) {
            alert("Error in Copying: " + e)
        }
    }

    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (!navigator.clipboard) {
                reject("Your Browser doesn't support Copying to Clipboard!")
                return
            }
    
            navigator.clipboard.writeText(text).then(res => resolve(res), reject => reject(res))
        })
    }

    async showOverlay(auto_hide=true, auto_hide_duration=1500) {
        if (this.element_type == 'div')
            this.overlay.classList.add('visible')
        else if (this.element_type == 'textarea') {
            await this._createAndAddOverlay(true)
        }

        if (auto_hide)
            setTimeout(() => this.hideOverlay(), auto_hide_duration)
    }

    hideOverlay() {
        this.overlay.classList.remove('visible')
        if (this.element_type == 'textarea')
            setTimeout(() => document.body.removeChild(this.overlay), 1000)
    }

    getCopyImage() {
        let icon = this.getTheme()
        if (this.data.iconStyle) 
            icon = this.data.iconStyle
        
        icon = icon.replace('-alt', '')

        return `img/blockonomics_icons/copy-${icon}.png`
    }

    getCheckImage() {
        let icon = this.getTheme()
        icon = icon.replace('-alt', '')
        
        /** Why Base64?
         * 
         * When using with Textarea elements, the icon images are loaded on demand i.e. when user click on copy button
         * and the overlay div is added to DOM. Which causes a blank space while the icon image is being loaded!
         * 
         * Since overlay is only visible for a short duration, the image might never get loaded and may never be visible!
         * Image loading works great when Browser's Cache is enabled, but when it's disabled or when the network is slow, 
         * it causes the above specified behavior
         * 
         */
        
        if (icon == 'dark')
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKLSURBVHgB7VmLkdowEF1SgUtwB3EHRyfoKggdhA6ODqCDpANIBVwqcDrwdfAijcXEJ3ZlfRZfMuHN7Bhs7X9lr9dEDzzwf2NFigCwtofO0pM/Np4c3iz98vTT0nm1Wp3po2GNbix9tTQgH72lg6WWloY3/AV6OCzmiFX0BWURn0NvydA9gXjUBx9JY6mz1Ez4Gn/OXTsiHoAX0oY34BSJ3HZqcKJM43k5XHLlzSm7gI/4lirhnecyciINgC+bHoqbzskCn426cvJp5tLbkjK8E1ymy7IsREU18ok6XXnl7weMd5RQUEt3hndiqColL0QnlQXAuLFDpGeBiX5PC4MppV0Ns6GFwWRhSGVcFzHmG7jBWOu9+81cb3C7F9YpgncB04GU4Y2fDRLGtmOKd/vwkyD/c/D/BynCR/sYnH4Tlp+D/2tKUBA+TDpSAhP5K4ywvgvWzd9MmLprIsaINSysTzbe8zRIKLWQ6R0i6/pg6UbT+Fx7ShzgOsiNpvE59sQMk0rICIZtFI0vKqE+YOoia0UnUGm8lx9u4ksK07cchREnqowXZH+fXpeeA+F9/4kisPOdoz080zye/dochLpfZznAtBJI6ARnMmGoAChpJQTGpFZacMJQARhZ6R0xbvuhZGb8mTYMqOhicXszSe/JcHv7Ss6CBjAOz0K0OTKckH0g4CNfKfM7YvD9eI/lX+rLdYJ/N116rGKoBkwpqWcC8mBrTxqAPBfVGC1K0+75tiFDSSOk95oNUyBvC3m4e4LmcHeieA8ZqeP1A+LjdZ2yiThxfVBpQ2XaneqE23RH6MFlVr9kMhzpkQ8X8V2N4ff4zOrIjWVaT9PPrI5cO+za9de/4jPrAw/84/gNdmJbUKPGB0kAAAAASUVORK5CYII="
        else
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJiSURBVHgB7Zn/VcIwEMe/OkFHyAaygd2kcQK7gWwgG5QNdANgAnSCugFsoMkzfQ+TS8kl1/KH/bx3D5Fe8u39SEMAFhb+N3eQpTa2MvboXitnlrOxL2efxvbObo4V+GLsZOybab2xzpjCDbDCX8EXHbNZb+QZeRFPyYjGxIxF3d5U50QMPTBQuf/Zz7YYD8ArJsAK2CEeuRZ/BaegnS815jFjvFGOoCPeopwWdEZ2EIIqGxs5BTkU6GwUl5MGnV4FeRToTGdnWSGMinTkU+a05ZXVDx0xkML0KIQ9wS4lBcFUZtAS87Oy4Ee/x/z4pbRm+AbOGvPjZ+GU6ljnOjJp3Ni9+9unQtgLNRJYI9xoSdMgLUhbjPThfcTpwXt/gCyNE3bJOXLt3ntfIwH/YbKCHH7kr/XYChmLiV931YiYsRqmrueIh5ub3Y/+BDH8laoRFs/Vw3agdpCNsHiOnqiwWAlp0MIaQfFZJdQjvYk14jdRKh4Im/iY4vTGnFCDFloqnhr7/fLD2HPAX/cfMc7W2BOu84Rw/b+GP/cHEqgR1l3KTlBDLvIDWVsJyjF1K60hJ14j4yE2sC5w1u76E8p2sb2noeM4+8sXJwsSPBPzKzDZIOwFhelRCEuYFf0Baj/eY/4v9UVzUt9N5z5W0ShkQwwqnQkF+mBrAyF2oNd3icaOnXYnbRtSqUCnd8iGBg87Xov44e4Owoe7AxvEn7apx+sdxo/XxcomhkY8ciUmddqdhEJ4YlBiNuqTlMw1FH5vJCcjNuJrFAif4mdWa/ZYRjm7/JnVmt0OH9zrHgsLC0X8AGDcDy65U+3zAAAAAElFTkSuQmCC"
    }

    getTheme() {
        return this.data.style || 'dark'
    }
}
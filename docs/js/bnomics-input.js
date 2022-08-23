class BlocknomicsInput {
    constructor(ele) {
        this.ele = ele
        this.init()
    }

    init() {
        this.load_data()
        this.addHelpers()
    }

    load_data() {
        this.data = this.ele.dataset
    }

    addHelpers() {

        this.ele.classList.add(this.getTheme())

        let content = document.createElement('div')
        content.classList.add('bnomics-input--content')

        let content_text = document.createElement('div')
        content_text.classList.add('bnomics-input--content--text')
        content_text.innerHTML = this.ele.innerHTML
        
        content.appendChild(content_text)

        // Copied Overlay
        let overlay = document.createElement('span')
        overlay.classList.add('bnomics-input--overlay')
        
        let overlay_text = document.createElement('span')
        overlay_text.innerHTML = "Copied"
        overlay.appendChild(overlay_text)
        
        let overlay_icon = document.createElement('img')
        overlay_icon.setAttribute('src', this.getCheckImage())
        overlay.appendChild(overlay_icon)

        content.appendChild(overlay)

        this.ele.innerHTML = ""
        this.ele.appendChild(content)

        // Copy Button
        let copy_button = document.createElement('a')
        copy_button.setAttribute('href', '#')
        copy_button.classList.add('bnomics-input--copy')

        let icon = document.createElement('img')
        icon.setAttribute('src', this.getCopyImage())
        copy_button.appendChild(icon)
        
        this.ele.appendChild(copy_button)

        copy_button.addEventListener('click', (e) => this.handleCopy(e))
        
        this.copy_button = copy_button
        this.overlay = overlay
        this.content_container = content_text

        this.ele.classList.add('has-copy')
    }

    async handleCopy(e) {
        e.preventDefault()
        try {
            
            let content = this.data.copy
            
            if (!content || content.length == 0)
                content = this.content_container.innerText

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

    showOverlay(auto_hide=true, auto_hide_duration=1500) {
        this.overlay.classList.add('visible')

        if (auto_hide)
            setTimeout(() => this.hideOverlay(), auto_hide_duration)
    }

    hideOverlay() {
        this.overlay.classList.remove('visible')
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
        if (this.data.iconStyle) 
            icon = this.data.iconStyle
        
        icon = icon.replace('-alt', '')

        return `img/blockonomics_icons/confirm-circle-${icon}.png`
    }

    getTheme() {
        return this.data.style || 'dark'
    }
}
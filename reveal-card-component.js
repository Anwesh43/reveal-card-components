class RevealCardComponent extends HTMLElement {
    constructor() {
        super()
        this.src = this.getAttribute('src')
        this.color = this.getAttribute('color')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    draw() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.drawImage(this.image,this.x,this.y,this.w,this.h*0.8)
        context.save()
        context.translate(0,this.y)
        context.save()
        context.fillStyle = this.color
        context.globalAlpha = 0.5
        context.fillRect(0,0,this.w,this.h)
        context.restore()
        context.restore()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            this.w = window.innerWidth /3
            this.h = ((this.w * (this.image.height)/(this.image.width))*1.25)
            this.y = (this.h*0.8)
            this.draw()
        }
    }
}
customElements.define('reveal-card-component',RevealCardComponent)

class RevealCardComponent extends HTMLElement {
    constructor() {
        super()
        this.src = this.getAttribute('src')
        this.color = this.getAttribute('color')
        this.img = document.createElement('img')
        this.revealButton = new RevealButton()
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    setState(obj) {
        this.state = Object.assign({},this.state,obj)
    }
    draw() {
        const w = this.state.w,h = this.state.h ,y = this.state.y,dir = this.state.dir
        console.log(`w is ${w},h is ${h},y is ${y}`)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.drawImage(this.image,0,0,w,h*0.8)
        context.save()
        context.translate(0,y)
        context.save()
        context.fillStyle = this.color
        context.globalAlpha = 0.5
        context.fillRect(0,0,w,h)
        context.restore()
        this.revealButton.draw(context,y,w,h,dir)
        context.restore()
        this.img.src = canvas.toDataURL()
    }
    render() {
        var dir = 0
        if(this.state.y >= this.state.h*0.8) {
            dir = -1
        }
        else {
            dir = 1
        }
        this.setState({dir})
        const interval = setInterval(()=>{
            this.draw()
            this.setState({y:this.state.y +(0.8*this.state.h/5)*this.state.dir})
            console.log(this.state.y)
            //this.state.y += this.state.h/10*this.state.dir
            if(this.state.y < 0) {

                this.setState({y:0,dir:0})
                //this.state.dir = 0
                clearInterval(interval)
            }
            if(this.state.y>0.8*this.state.h) {
              this.setState({y:0.8*this.state.h,dir:0})
              //this.state.dir = 0
              clearInterval(interval)
            }
        },100)

    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = this.src
        this.image.onload = () => {
            const w = window.innerWidth /3
            const h = ((w * (this.image.height)/(this.image.width))*1.25)
            const y = (h*0.8)
            //console.log(this.w+" "+this.h+" "+this.y)
            this.state = Object.create({},{w:{value:w,writable:false,enumerable:true},h:{value:h,writable:false,enumerable:true},y:{value:y,writable:false,enumerable:true},dir:{value:0,writable:false,enumerable:true}})
            this.draw()
            this.img.onmousedown = (event)=> {
                if(this.revealButton.handleTap(event.offsetX,event.offsetY)) {
                    this.render()
                }
            }
            //this.render()
        }
    }
}
class RevealButton {
    constructor() {
        this.deg = 0
    }
    draw(context,y,w,h,dir) {
        this.x = w/2
        this.y = y+0.1*h
        this.r = w/20
        context.fillStyle = "#BDBDBD"
        context.beginPath()
        context.arc(w/2,h/10,w/20,0,2*Math.PI)
        context.fill()
        context.strokeStyle = 'black'
        context.lineWidth = w/60
        for(var i=0;i<2;i++) {
            context.save()
            context.translate(w/2,h/10)
            context.rotate(this.deg*Math.PI/180+Math.PI/2*(i))
            context.beginPath()
            context.moveTo(0,-w/25)
            context.lineTo(0,w/25)
            context.stroke()
            context.restore()
        }
        this.deg += dir*9
    }
    handleTap(x,y) {
        console.log(this.x+" "+this.y)
        return x>=this.x-this.r && x<=this.x+this.r && y>=this.y-this.r && y <= this.y+this.r
    }
}
customElements.define('reveal-card-component',RevealCardComponent)

// die runtime ist impure

export const program = ({
    init,
    update,
    view
}) => {
    const messageQueue = []
    const pushMessage = (msg)=>messageQueue.push(msg)
    const fromLocalStorage = JSON.parse(localStorage['model'] ?? '{}')
    let model = Object.assign(init(),fromLocalStorage)
    const render = (model)=>{
        localStorage['model']=JSON.stringify(model)
        renderDom(model,view,pushMessage)
    }
    console.log('init',{model})
    render(model)
    const mainLoop = (timestamp)=>{
        if (messageQueue.length>0) {
            const msg = messageQueue.shift()
            const [updatedModel,command] = update(model,msg)
            const renderModel = executeCommand(updatedModel,command)
            console.log('update',{model,msg,updatedModel,command,renderModel})
            model = renderModel
            render(model)
        }
        requestAnimationFrame(mainLoop)
    }
    requestAnimationFrame(mainLoop)
}

export const Cmd = {
    none: {},
    log: (text)=>({log:true,text})
}

const executeCommand = (model,command) => {
    if (command===Cmd.none) {
        return model
    } else if (command.log) {
        console.log(command.text)
        return model
    }
}

const renderDom = (model,view,pushMessage) => {
    const jsx = view(model)
    const addListener = (element,eventName,message) =>
        element.addEventListener(eventName,()=>pushMessage(message))
    const dom = toDom(jsx,addListener)
    // console.log(model,jsx)
    document.body.innerHTML = ''
    document.body.appendChild(dom)
}

const toDom = (jsx,addListener) =>
    Array.isArray(jsx) ? toElement(jsx,addListener)
                       : toTextNode(jsx)

const toElement = ([tagName,attributes,...children],addListener) => {
    const element = document.createElement(tagName)
    setAttributes(element,attributes,addListener)
    children.forEach(child=>element.appendChild(toDom(child,addListener)))
    return element
}

const setAttributes = (element,attributes,addListener) =>
    Object.entries(attributes)
        .filter(([key,value])=>!/^__/.test(key))
        .forEach(([key,value])=>{
            if (/^on/.test(key)) {
                const eventName = key.substring(2).toLowerCase()
                addListener(element,eventName,value)
            } else {
                element.setAttribute(key,value)
            }
        })

const toTextNode = text => document.createTextNode(text)

export const React = {
    createElement: (...args) => args
}


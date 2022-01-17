// alles hier ist pure

import {
    Cmd,
    React,
    program
} from "./runtime";

const init = () => ({counter:0})

const update = (model, msg) => {
    // if (msg.log) {
    //     return [model, Cmd.log(msg.text)]
    // } else
    if (msg.inc) {
        return [{...model,counter:model.counter+1}, Cmd.none]
    } else if (msg.dec) {
        return [{...model,counter:model.counter-1}, Cmd.none]
    }
    return [model, Cmd.none]
}

const view = model => (
    <div className="app">
        <h2>
            Counter: {model.counter}
        </h2>
        <button onClick={{inc:true}}>increment</button>
        <button onClick={{dec:true}}>decrement</button>
    </div>
)

program({
    init,
    update,
    view,
})


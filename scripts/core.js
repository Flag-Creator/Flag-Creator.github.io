if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js');
    });
}

import "./html2canvas.js";


function editSelectorCSS (selector, style) {  
    if(document.querySelector(selector + "style")) {
        document.querySelector(selector + "style").innerHTML = style;
    } else {
        var el= document.createElement('style');
        el.type = 'text/css';
        el.id = selector + "style"
        el.appendChild(document.createTextNode(selector + style));
        return document.getElementsByTagName('head')[0].appendChild(el);
    }

}


let canvas = document.getElementById("canvas");
let controls = {
    dialog: document.getElementById("dialog"),
    count: document.getElementById("count"),
    split_x: document.getElementById("split_x"),
    split_y: document.getElementById("split_y"),
    deselect: document.getElementById("deselect"),
    showborder: document.getElementById("showborder"),
    symbolbtn: document.getElementById("symbolbtn"),
    export: document.getElementById("export"),
    color1: document.getElementById("color1"),
    usecolor1: document.getElementById("usecolor1"),
    color2: document.getElementById("color2"),
    usecolor2: document.getElementById("usecolor2"),
    color3: document.getElementById("color3"),
    usecolor3: document.getElementById("usecolor3")
}

if (! controls.dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
controls.symbolbtn.addEventListener('click', function() {
    controls.dialog.showModal();
});

controls.export.addEventListener('click', function() {
    //controls.dialog.showModal();
    deselectAll();
    html2canvas(document.querySelector("#canvas")).then(canvas => {
        //document.body.appendChild(canvas)
        let link = document.createElement('a');
        link.download = `flagcreator_${Date.now()}.png`;
        link.href = canvas.toDataURL()
        link.click();
    });
});

controls.dialog.querySelector('.close').addEventListener('click', function() {
    controls.dialog.close();
});



function updateColors() {
    editSelectorCSS('.color1', `{background-color:${controls.color1.value}}`);
    editSelectorCSS('.color2', `{background-color:${controls.color2.value}}`);
    editSelectorCSS('.color3', `{background-color:${controls.color3.value}}`);
}

function removeColors(e) {
    e.classList.remove("color1");
    e.classList.remove("color2");
    e.classList.remove("color3");
}

function deselect (e) {
    e.classList.remove('selected');
    e.classList.remove('selected_t1');
    e.classList.remove('selected_t2');
}

function deselectAll () {
    document.querySelectorAll('.selected').forEach(e => {
        e.classList.remove('selected');
    });

    document.querySelectorAll('.selected_t1').forEach(e => {
        e.classList.remove('selected_t1');
    });

    document.querySelectorAll('.selected_t2').forEach(e => {
        e.classList.remove('selected_t2');
    });
}

controls.color1.addEventListener("change", e=> {
    updateColors();
})

controls.color2.addEventListener("change", e=> {
    updateColors();
})

controls.color3.addEventListener("change", e=> {
    updateColors();
})


controls.usecolor1.addEventListener("click", e=> {
    document.querySelectorAll('.selected').forEach(e => {
        updateColors();
        removeColors(e);
        e.classList.add("color1");
    });    
})

controls.usecolor2.addEventListener("click", e=> {
    document.querySelectorAll('.selected').forEach(e => {
        updateColors();
        removeColors(e)
        e.classList.add("color2");
    });    
})

controls.usecolor3.addEventListener("click", e=> {
    document.querySelectorAll('.selected').forEach(e => {
        updateColors();
        removeColors(e)
        e.classList.add("color3");
    });    
})

controls.deselect.addEventListener("click", e=> {
    deselectAll();
})

controls.showborder.addEventListener("click", e=> {
    let elements = document.getElementsByClassName("element");
    for(let element of elements) {
        element.classList.add("selected");
    }
});

async function showBorders(classname, time) {

    let elements = document.getElementsByClassName(classname);


    [...elements].forEach(element => {        
        element.classList.add("selected");
    })

    
    await setTimeout(() => {
        [...elements].forEach(element => {        
            deselect(element);
        })
    }, 1000);
    
}

controls.split_x.addEventListener("click", e=> {
    let selected = document.getElementsByClassName("selected");
    let actionid = Date.now();


    [...selected].forEach(element => {
        let depth = element.dataset.depth;
        let parentid = element.dataset.parentid;
        element.innerText = null;
        element.classList.remove("selected");
        element.classList.add("flex_horizontal")
        
        let count = controls.count.value;
    
        for(let i = 0; i < count; i++) {
            let newelement = document.createElement("div");
            newelement.classList.add("element");
            newelement.classList.add(actionid);

            element.appendChild(newelement);
        }
    })


    deselectAll();

    showBorders(actionid);
})

controls.split_y.addEventListener("click", e=> {
    let selected = document.getElementsByClassName("selected");
    let actionid = Date.now();
    

    [...selected].forEach(element => {
        let depth = element.dataset.depth;
        let parentid = element.dataset.parentid;
        element.innerText = null;
        element.classList.remove("selected");
        element.classList.add("flex_vertical");
        
        let count = controls.count.value;
    
        for(let i = 0; i < count; i++) {
            let newelement = document.createElement("div");
            newelement.classList.add("element");
            newelement.classList.add(actionid);

            element.appendChild(newelement);

        }
    
    })

    deselectAll();

    showBorders(actionid);
});

canvas.addEventListener("click", function(e){
    deselectAll();
    let target = e.target;
    target.classList.add("selected");
});

let t = 1;
setInterval(function(){
    
    document.querySelectorAll('.selected').forEach(e => {
        e.classList.add(`selected_t${t}`)
        e.classList.remove(`selected_t${(t == 1) ? 2 : 1}`)
    });

    t = (t == 1) ? 2 : 1;
}, 200);
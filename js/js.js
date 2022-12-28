const funTime  = (timeActual) =>{
    const brutoTime = (new Date(timeActual) - new Date() + 1000) / 1000
    const seconds = (`0` + Math.floor(brutoTime % 60)).slice(-2)
    const minutes = (`0` + Math.floor(brutoTime / 60 % 60)).slice(-2)
    const hours = Math.floor(brutoTime / 360 % 24)
    const days = Math.floor(brutoTime / (3600 * 24)) 
    // console.log(`${days} - ${hours} - ${minutes} - ${seconds}`)
    return objetTime = {
        brutoTime,
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days
    }
}

const createElement  = (objectLocal) =>{
    const fragment = document.createDocumentFragment()

    const list__Item = document.createElement(`LI`);
    list__Item.classList.add(`list__item`)

    const text_task = document.createElement(`P`);
    text_task.classList.add(`text-task`)
    text_task.textContent = objectLocal.task

    const content_timer = document.createElement(`DIV`);
    content_timer.classList.add(`content-timer`)

    const timer = document.createElement(`DIV`);
    timer.classList.add(`timer`)

    const time_part_days = document.createElement(`DIV`);
    const time_part_hours = document.createElement(`DIV`);
    const time_part_minutes = document.createElement(`DIV`);
    const time_part_seconds = document.createElement(`DIV`);
    time_part_days.classList.add(`timer__part`)
    time_part_hours.classList.add(`timer__part`)
    time_part_minutes.classList.add(`timer__part`)
    time_part_seconds.classList.add(`timer__part`)

    const deleted = document.createElement(`DIV`);
    deleted.classList.add(`deleted`)

    deleted.addEventListener(`click`, ()=>{
        localStorage.removeItem(objectLocal.id)

        list.textContent = ""
        // const keys = Object.keys(localStorage)
        // for(const key of keys){
        //     const element = JSON.parse(localStorage.getItem(key))

        // }
        storageLoad()
    })

    const p_days = document.createElement(`P`);
    const p_hours = document.createElement(`P`);
    const p_minutes = document.createElement(`P`);
    const p_seconds = document.createElement(`P`);

    // Este es el código del setTimeOut, la cuestion es que este se ejecutará un minuto despues de leerse por lo cual
    // genera un deleat al aparecer los items por lo cual hasta que esto este lo agregamos manual.

    const bb = funTime(objectLocal.time)
        
    p_days.textContent = bb.days
    p_hours.textContent = bb.hours
    p_minutes.textContent = bb.minutes
    p_seconds.textContent = bb.seconds
// ------- Hasta aqui , luego lo mismpo pero con setTimeOut.
    const interval = setInterval(() => {
        const bb = funTime(objectLocal.time)
        
        p_days.textContent = bb.days
        p_hours.textContent = bb.hours
        p_minutes.textContent = bb.minutes
        p_seconds.textContent = bb.seconds
        
        if(bb.brutoTime <= 1) clearInterval(interval)
    }, 1000);

    const span_days = document.createElement(`SPAN`);
    const span_hours = document.createElement(`SPAN`);
    const span_minutes = document.createElement(`SPAN`);
    const span_seconds = document.createElement(`SPAN`);
    span_days.textContent = `D`
    span_hours.textContent = `H`
    span_minutes.textContent = `M`
    span_seconds.textContent = `S`

    // Ingresemos cada cosa en su lugar:

    time_part_days.append(p_days)
    time_part_days.append(span_days)

    time_part_hours.append(p_hours)
    time_part_hours.append(span_hours)

    time_part_minutes.append(p_minutes)
    time_part_minutes.append(span_minutes)

    time_part_seconds.append(p_seconds)
    time_part_seconds.append(span_seconds)

    timer.appendChild(time_part_days)
    timer.appendChild(time_part_hours)
    timer.appendChild(time_part_minutes)
    timer.appendChild(time_part_seconds)

    content_timer.appendChild(timer)
    content_timer.appendChild(deleted)

    list__Item.appendChild(text_task)
    list__Item.appendChild(content_timer)

    switch (objectLocal.color) {
        case "red": list__Item.classList.add(`list__item--red`);
        break;
        case "orange": list__Item.classList.add(`list__item--orange`);
        break;
        case "green": list__Item.classList.add(`list__item--green`);
        break;
    }

    fragment.appendChild(list__Item)

    return fragment
}

const storageLoad = ()=>{
    const arrayKeys = Object.keys(localStorage)

    for(const key of arrayKeys){
        const element = JSON.parse(localStorage.getItem(key))
        const block = createElement(element)
        list.appendChild(block)
    }
}




const text = document.getElementById(`text`);
const task = document.getElementById(`task`);
const content_radio = document.getElementById(`content-radio`);
const datetime_local = document.getElementById(`datetime-local`);
const btn = document.getElementById(`btn`);

const formisValid = {
    task: false,
    datetime_local: false
}


const getDate = {
    color: "red"
}

const form__input_radio = document.querySelectorAll(`.form__input-radio`);
const styles = document.documentElement.style

content_radio.addEventListener(`change`, () =>{
    for(const element of form__input_radio){
        if(element.checked){
            getDate.color = element.id
        } 
    }
})

task.addEventListener(`change`, e =>{
    if(e.target.value.length > 10){
        formisValid.task = true
        getDate.task = e.target.value
    } 
    else formisValid.task = false
})

// timer

const _days = document.getElementById(`days`);
const _hours = document.getElementById(`hours`);
const _minutes = document.getElementById(`minutes`);
const _seconds = document.getElementById(`seconds`);

const list = document.getElementById(`list`);

datetime_local.addEventListener(`change`, e =>{

    const a = new Date(e.target.value) - new Date()
    if(a > 0){
        formisValid.datetime_local = true
        getDate.time = e.target.value
    } 
    else formisValid.datetime_local = false
})

btn.addEventListener(`click`, e =>{
    e.preventDefault()

    if(formisValid.task == false && formisValid.datetime_local == false) text.textContent = `La tarea y fecha no se completaron de manera correcta`
    else if(formisValid.task == false) text.textContent = `La tarea no se ha completado`
    else if(formisValid.datetime_local == false) text.textContent = `La fecha no es valida`

    setTimeout(() => {
        text.textContent = ""
    }, 1500);

    const valid = Object.values(formisValid)
    const valor = valid.findIndex(element => element == false)
    if(valor == -1){
        const random = Math.floor(Math.random() * 100)
        getDate.id = random 
        localStorage.setItem(getDate.id, JSON.stringify(getDate))

        // Con las siguientes 4 lineas reiniciamos la cuestion
        task.value = ""
        datetime_local.value = ""
        formisValid.task = false
        formisValid.datetime_local = false

        // Con esto actualizamops el storage por cada click al lapiz.
        list.textContent = ""
        storageLoad()
    }
})

storageLoad()


// new Date(); Devuelve el dia, mes, año y hora ctual.
// Si hacemos new Date("fecha_del_input/otra") simplemente se guarda en la variable esta fecha / podemos imprimirla.

// Si hacemos const number = new Date("2022-01-22T18:01") - new Date(); en la variable number tenemos la fecha 
// (que seria la posterior) menos la fecha de hoy = el tiempo que falta para llegar a esa fecha.




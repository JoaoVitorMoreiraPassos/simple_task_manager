//FUNÇOES AUXILIARES
let getDate = (year, month, day) => {
    months_length = [31,year/4 == 0?29:28, 31, 30, 31,30,31,31,30,31,30,31];
    for(let i = 0; i < month; i ++)day += months_length[i];
    return (year * 365) + day;
}
let myappend = (dad, sons) => {
    for (let i in sons)
        dad.appendChild(sons[i]);
}
let myCreateElements = (element, quant) =>{
    let elements = [];
    for (let i = 0; i < quant; i++)elements.push(document.createElement(element));
    return elements;
}
let exchanger = (obj, atributo, pos1, pos2) => {
    let aux = obj[pos1][atributo];
    obj[pos1][atributo] = obj[pos2][atributo];
    obj[pos2][atributo] = aux;
}
let removeElement = (id) => {
    let node = document.getElementById(id);
    try{
        if(node.parentNode)
            node.parentNode.removeChild(node);
        return 1;
    }catch{return 0;}
}
let findTask = (bd, materia, id) =>{
    for (let i in bd)
    {
        if(bd[i].nome.toUpperCase() == materia.toUpperCase())
        {
            for(let j in bd[i].atividades)
                if(bd[i].atividades[j].id == id) return [i,j];
        }
    }
    return -1;
}

//CRIAÇÃO E MANIPULAÇÃO DE ELEMENTOS
let createNewTaskMenu = (bd) => {
    let insert_task = document.createElement("section");
    insert_task.id = "insert_task";
    insert_task.classList = "active back-blue";
    let select = document.createElement("select");
    select.id = "materia_select";
    let inputs = myCreateElements("input", 3);
    inputs[0].type = "text";
    inputs[0].id = "newtask";
    inputs[0].placeholder = "exercício 1";
    
    inputs[1].type = "date";
    inputs[1].id = "enddate";

    inputs[2].type = "time";
    inputs[2].id = "endtime";
    inputs[2].value = "23:59";

    let label = myCreateElements("label", 3);
    label[0].textContent = "Matéria";
    let padrao = document.createElement("option");
    padrao.innerHTML = "Selecione uma materia";
    padrao.classList = "hidde";
    select.appendChild(padrao);
    for(let i in bd)
    {
        let option = document.createElement("option");
        option.value = bd[i].nome;
        option.innerHTML = bd[i].nome;
        select.appendChild(option);
    }
    myappend(insert_task, [label[0], select]);

    label[1].textContent = "Atividade";
    myappend(insert_task, [label[1], inputs[0]]);

    label[2].textContent = "Data";
    let div = document.createElement("div");
    div.id = "end_task";
    myappend(div, [inputs[1], inputs[2]]);
    myappend(insert_task, [label[2], div]);

    let btn = document.createElement("button");
    btn.id = "inseriratividade";
    btn.textContent = "Inserir";
    btn.addEventListener("click", ()=>{registerTask(1)});
    insert_task.appendChild(btn);
    document.getElementById("mains").appendChild(insert_task);

}
let createNewSubjects = ()=> {
    let cadastro = document.createElement("section");
    cadastro.id = "cadastro";
    cadastro.classList = "active back-blue"
    let h2 = document.createElement("h2");
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    h2.textContent = "Cadastrar matéria";
    input.id = "novamateria";
    input.placeholder = "Matemática";
    input.type = "text";
    let btn = document.createElement("button");
    btn.textContent = "Inserir";
    btn.id = "confirmarcadastro";
    btn.addEventListener("click", registerSubject);

    myappend(div, [label, input]);
    myappend(cadastro, [h2, div, btn]);
    document.getElementById("mains").appendChild(cadastro);
}
let createTaskTable = () => {
    //PRIMEIRO REMOVE UMA POSSIVEL TABELA JÁ CRIADA.
    removeElement("tasks");
    
    let bd = JSON.parse(localStorage.getItem("database"));
    //INSERE TODAS AS ATIVIDADES EM UM ARRAY.
    let alltasks = [];
    for(let i in bd)
    {
        for(let j in bd[i].atividades)
            alltasks.push(bd[i].atividades[j]);
    }
    //ORDENA ATIVIDADES POR DATA
    for (let i = 0; i < alltasks.length; i ++)
    {
        for (let j = i+1; j < alltasks.length; j ++)
        {
            let time_i, time_j;
            time_i = alltasks[i].data.split("-").map((str)=>{ return parseInt(str); });
            time_j = alltasks[j].data.split("-").map((str)=>{ return parseInt(str); });
            time_i = getDate(time_i[0],time_i[1],time_i[2])
            time_j = getDate(time_j[0],time_j[1],time_j[2]);
            if(time_i > time_j)
            {
                exchanger(alltasks, "id", i, j);
                exchanger(alltasks, "task_name", i, j);
                exchanger(alltasks, "materia", i, j);
                exchanger(alltasks, "data", i, j);
                exchanger(alltasks, "time", i, j);
            }
        }
    }
    //CRIA OS ELEMENTOS DA TABELA
    let tasks = document.createElement("section");
    tasks.id = "tasks";
    tasks.innerHTML = "";
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tr1 = document.createElement("tr");
    let ths = myCreateElements("th", 5);
    ths[0].innerHTML = "Nº";
    ths[1].innerHTML = "Atividade";
    ths[2].innerHTML = "Matéria";
    ths[3].innerHTML ="Data";
    ths[4].innerHTML = "Ação";
    ths[4].colSpan = "2";
    tr1.classList = "back-blue";
    myappend(tr1, ths);
    myappend(thead, [tr1]);
    myappend(table, [thead]);
    for(let i in alltasks)
    {
        let tbody = document.createElement("tbody");
        let tr2 = document.createElement("tr");
        let tds = myCreateElements("td", 6);
        let temp = alltasks[i].data.split("-");
        temp = temp.reverse();
        temp = temp.join("-");
        tds[0].innerHTML = `${parseInt(i)+1}`;
        tds[1].innerHTML = alltasks[i].task_name;
        tds[2].innerHTML = alltasks[i].materia;
        tds[3].innerHTML = temp+ " " + alltasks[i].hora;
        tds[4].innerHTML = "Editar";
        tds[4].classList = "back-edit";
        tds[4].addEventListener("click", ()=> {createEditor(alltasks[i])})
        tds[5].innerHTML = "Feita";
        tds[5].classList = "back-del";
        tds[5].addEventListener("click", ()=> { removeTask(alltasks[i].materia, alltasks[i].id, alltasks) })
        tr2.classList = "back-white";
        myappend(tr2, tds);
        myappend(tbody, [tr2]);
        myappend(table, [tbody]);
    }
    table.border = "1";
    tasks.appendChild(table);
    tasks.classList = alltasks.length > 0 ? "active-table" : "hidde";
    document.getElementById("mains").appendChild(tasks);
}
let createEditor = (obj) => {
    //CRIA JANELA DE EDIÇÃO DE ATIVIDADES.
    let bd = JSON.parse(localStorage.getItem("database"));
    let section = document.createElement("section");
    section.id = "editor";
    section.classList = "back-blue editor";
    let divs = myCreateElements("div", 3);
    divs[0].classList = "editor-exit";
    divs[1].classList = "editorboxes";
    divs[2].classList = "editorboxes";

    let inputs = myCreateElements("input", 3);
    let select = document.createElement("select");
    let padrao = document.createElement("option");

    padrao.innerHTML = obj.materia;
    select.id = "edit_select";
    select.appendChild(padrao);
    for(let i in bd)
    {
        if(bd[i].nome.toUpperCase() == obj.materia.toUpperCase()) continue
        let option = document.createElement("option");
        option.value = bd[i].nome;
        option.innerHTML = bd[i].nome;
        select.appendChild(option);
    }
    inputs[0].value = obj.task_name;
    inputs[0].id = "edit_task_name";
    inputs[1].type = "date";
    inputs[1].id = "edit_date";
    inputs[1].value = obj.data;
    inputs[2].id = "edit_time";
    inputs[2].type = "time";
    inputs[2].value = obj.hora;
    btns = myCreateElements("button",2);
    btns[0].classList = "btn-edit";
    btns[0].textContent = "Alterar";
    btns[0].addEventListener("click", () => {editTask(obj)})
    let cancel = document.createElement("img");
    cancel.src = "./cancel.png";
    cancel.classList = "cancel";
    btns[1].classList = "btn-exit";
    myappend(btns[1], [cancel]);
    divs[1].appendChild(select);
    myappend(divs[1], inputs);
    divs[2].appendChild(btns[0]);
    divs[0].appendChild(btns[1]);
    myappend(section, divs);
    document.getElementById("mains").classList = "hidde";
    document.getElementById("conteiner").appendChild(section);
}
let closeEditor = () =>{
    let temp = document.getElementById("editor");
    if (temp.parentNode)
        temp.parentNode.removeChild(temp);
    document.getElementById("mains").classList = "active";
}

// GERENCIAR ATIVIDADES E MÁTERIAS
let removeTask = (materia,id) => {
    let bd = JSON.parse(localStorage.getItem("database"));
    let made = JSON.parse(localStorage.getItem("made")) ?? [];
    let [i, j] = findTask(bd, materia, id);
    made.push(bd[i].atividades[j]);
    bd[parseInt(i)].atividades.splice(parseInt(j), 1);
    localStorage.setItem("database", JSON.stringify(bd));
    createTaskTable();
}
let editTask = (obj) => {
    let bd = JSON.parse(localStorage.getItem("database"));
    let infos = [];
    infos[0] = document.getElementById("edit_select").value;
    infos[1] = document.getElementById("edit_task_name").value;
    infos[2] = document.getElementById("edit_date").value;
    infos[3] = document.getElementById("edit_time").value;
    // VERIFICA SE A MATÉRIA FOI TROCADA.
    if(infos[0].toUpperCase() != obj.materia.toUpperCase())
    {
        removeTask(obj.materia, obj.id);
        registerTask(0);
        closeEditor();
    }
    else{//SE APENAS AS OUTRAS INFOS FORAM TROCADAS.
        let [i, j] = findTask(bd, obj.materia, obj.id);
        i = parseInt(i);
        j = parseInt(j);
        bd[i].atividades[j].materia = infos[0];
        bd[i].atividades[j].task_name = infos[1];
        bd[i].atividades[j].data = infos[2];
        bd[i].atividades[j].hora = infos[3];
        
        localStorage.setItem("database", JSON.stringify(bd));
        closeEditor();
        createTaskTable();
    }
}
let registerSubject = () =>{
    let novamateria = document.getElementById("novamateria");
    let bd = JSON.parse(localStorage.getItem("database")) ?? [];
    let objeto = {
        "nome": novamateria.value,
        "atividades": []
    }
    bd.push(objeto);
    localStorage.setItem("database",JSON.stringify(bd));
    novamateria.value = "";
    document.getElementById("abrircadastroatividade").classList = "active";
}
let registerTask = (metodo) => {
    let bd = JSON.parse(localStorage.getItem("database"));
    let materia = metodo == 1 ? document.getElementById("materia_select").value : document.getElementById("edit_select").value;
    let atividade = metodo == 1 ? document.getElementById("newtask").value : document.getElementById("edit_task_name").value;
    let data = metodo == 1 ? document.getElementById("enddate").value : document.getElementById("edit_date").value;
    let time = metodo == 1 ? document.getElementById("endtime").value : document.getElementById("edit_time").value;
    for (let i in bd)
    {
        if(bd[i].nome.toUpperCase() == materia.toUpperCase())
        {
            bd[i].atividades.push({"id": bd[i].atividades.length == 0 ? "1":parseInt(bd[i].atividades[bd[i].atividades.length-1].id) + 1,
                                   "task_name": atividade,
                                   "materia": materia,
                                   "data": data,
                                   "hora": time});
        }
    }
    localStorage.setItem("database", JSON.stringify(bd));
    createTaskTable();
}

//INICIAR PROGRAMA
let begginer = () => {
    let bd = JSON.parse(localStorage.getItem("database")) ?? [];
    document.getElementById("abrircadastro").classList = "hidde";
    document.getElementById("abrircadastroatividade").classList = bd.length == 0 ? "hidde": "active";
    createNewSubjects();
    removeElement("insert_task");
    removeElement("tasks");
}
let veteran = () => {
    let bd = JSON.parse(localStorage.getItem("database"));
    document.getElementById("abrircadastroatividade").classList = "hidde";
    document.getElementById("abrircadastro").classList = "active";
   
    createNewTaskMenu(bd);
    removeElement("cadastro");
    createTaskTable();
}
let start = () => {
    let bd = localStorage.getItem("database") ?? [];
    if(bd.length == 0) begginer();
    else veteran();
}

start();

document.getElementById("abrircadastro").addEventListener("click", begginer);
document.getElementById("abrircadastroatividade").addEventListener("click", veteran);

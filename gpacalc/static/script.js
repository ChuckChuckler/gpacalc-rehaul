let classes = [];
let num = 0;

function signup(){
    let user = document.getElementById("suUser");
    let passw = document.getElementById("suPass");
    let errorMsg = document.getElementById("errormsg");

    if(user.value == ""){
        errorMsg.innerText = "no username";
    }else if(passw.value == ""){
        errorMsg.innerText = "no password";
    }else{
        fetch("/signup", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: [user.value, passw.value]})
        })

        .then(response => {
            if(!response.ok){
                console.log("response not okay");
            }else{
                return response.json();
            }
        })

        .then(data => {
            if(data.message == "euge"){
                errorMsg.innerText = "success!";
            }else{
                errorMsg.innerText = data.message;
            }
        })

        .catch(error => {
            errorMsg.innerText = error;
        })
    }
}

function login(){
    let user = document.getElementById("liUser");
    let passw = document.getElementById("liPass");
    let errorMsg = document.getElementById("errormsg");

    if(user.value == ""){
        errorMsg.innerText = "no username";
    }else if(passw.value == ""){
        errorMsg.innerText = "no password";
    }else{
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: [user.value, passw.value]})
        })

        .then(response=>{
            if(!response.ok){
                console.log("response not ok")
                errorMsg.innerText = "bad response"
            }else{
                return response.json();
            }
        })

        .then(data=>{
            if(data.message == "euge"){
                window.location.href = data.rdrct;
            }else{
                errorMsg.innerText = data.message;
            }
        })

        .catch(error=>{
            errorMsg.innerText = error;
        })
    }
}

function setup(user, classesFrom){
    classes = classesFrom;
    let msg = document.getElementById("infomsg");
    document.getElementById("user").innerText = `Welcome, ${user}!`;
    if(classes.length == 1){
        msg.innerText = "You don't have any classes yet! Click create to get started.";
    }else{
        for(let i = 0; i < classes.length; i++){
            create();
        }

        for(let i = 0; i < classes.length; i++){
            document.getElementById("className" + (i+1)).value = classes[i][0];
            document.getElementById("classDiff" + (i+1)).value = classes[i][1];
            document.getElementById("classGrade" + (i+1)).value = classes[i][2];
            document.getElementById("classLength" + (i+1)).value = classes[i][3];
        }
    }
}

function create(){
    document.getElementById("infomsg").style.display = "none";
    document.getElementById("initialCreateBtn").style.display = "none";
    document.getElementById("bodyHolder").style.display = "block";

    num += 1;

    let newClass = document.createElement("tr");
    let classNameHolder = document.createElement("td");
    let classDiffHolder = document.createElement("td");
    let classGradeHolder = document.createElement("td");
    let classLengthHolder = document.createElement("td");

    let className = document.createElement("input");
    classNameHolder.className = "td1";
    className.type = "text";
    className.id = "className" + num;

    let classDiff = document.createElement("select");
    classDiff.id = "classDiff" + num;
    classDiffHolder.className = "td2";

    let classDiffNames = ["None", "CP", "Honors", "AP"]

    for(let i = 0; i < 4; i++){
        let option = document.createElement("option");
        option.value = classDiffNames[i];
        option.innerText = classDiffNames[i];
        classDiff.appendChild(option);
    }

    let classGrade = document.createElement("select");
    classGrade.id = "classGrade" + num;
    classGradeHolder.className = "td2";
    let classGradeNames = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
    let classGradeVals = [[4.0, 4.5, 5], [3.7, 4.2, 4.7], [3.5, 4.0, 4.5], [3.3, 3.8, 4.3], [3.0, 3.5, 4.0], [2.7, 3.2, 3.7], [2.4, 2.9, 3.4], [2.0, 2.5, 3.0], [1.7, 2.2, 2.7], [1.0, 1.5, 2.0], [0.0,0.0,0.0]];
    for(let i = 0; i < classGradeNames.length; i++){
        let option = document.createElement("option");
        option.innerText = classGradeNames[i];
        option.value = classGradeVals[i];
        classGrade.appendChild(option);
    }

    let classLength = document.createElement("select");
    classLength.id = "classLength" + num;
    classLengthHolder.className = 'td2';
    let classLengthNames = ["Semester", "Full-Year"];
    let classLengthVals = [2.5, 5.0];

    for(let i=0; i < 2; i++){
        let option = document.createElement("option");
        option.innerText = classLengthNames[i];
        option.value = classLengthVals[i];
        classLength.appendChild(option);
    }
    

    let classComps = [className, classDiff, classGrade, classLength];
    let classCompHolders = [classNameHolder, classDiffHolder, classGradeHolder, classLengthHolder];

    for(let i=0; i < 4; i++){
        classCompHolders[i].appendChild(classComps[i]);
        newClass.appendChild(classCompHolders[i]);
    }

    document.getElementById("classesTable").appendChild(newClass);
}

function calc(){
    let qualPoints = 0.0;
    let totalCreds = 0.0;

    for(let i = 0; i < num; i++){
        if(document.getElementById("classDiff"+(i+1)).value != "None"){
            let potentials = document.getElementById("classGrade"+(i+1)).value.split(",");
            let type = document.getElementById("classDiff" + (i+1)).value;
            if(type == "CP"){
                potentials = parseFloat(potentials[0]);
            }else if(type == "Honors"){
                potentials = parseFloat(potentials[1]);
            }else{
                potentials = parseFloat(potentials[2]);
            }

            qualPoints += potentials*parseFloat(document.getElementById("classLength" + (i+1)).value);
            totalCreds += parseFloat(document.getElementById("classLength" + (i+1)).value);
        }
    }

    document.getElementById("gpaDisp").innerText = "GPA: " + Math.round((qualPoints/totalCreds)*10000)/10000;
}

function save(){
    let classesArr = [];
    for(let i = 0; i < num; i++){
        let classArr = [document.getElementById("className" + (i+1)).value, document.getElementById("classDiff" + (i+1)).value, document.getElementById("classGrade" + (i+1)).value, document.getElementById("classLength" + (i+1)).value]
        classesArr.push(classArr);
    }
    
    fetch("/save", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data: classesArr})
    })
}
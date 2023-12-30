//Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secondsInput = document.getElementById("secondsInput");
const meridiemInput = document.getElementById("meridiemInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
    initialMinute = 0,
    initialSeconds = 0,
    alarmIndex = 0;

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
    let alarmObject,
        objIndex,
        exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObject, objIndex];
};

//Display Time
function displayTimer() {
    let date = new Date();
    //let currenTime = date.toLocaleTimeString();
    let meridiem = "AM";

    let [hours, minutes, seconds] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    if (hours == 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = appendZero(hours - 12);
        meridiem = "PM";
    }

    //Display time
    timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${meridiem}`;

    //Alarm
    alarmsArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSeconds} ${alarm.alarmMeridiem}` === `${hours}:${minutes}:${seconds} ${meridiem}`) {
                alarmSound.play();
                alarmSound.loop = true;
                alert("Alarm ringing!");
            }
        }
    });
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue);
    }
    return inputValue;
};


hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});

secondsInput.addEventListener("input", () => {
    secondsInput.value = inputCheck(secondsInput.value);
});

meridiemInput.addEventListener("input", () => {
    meridiemInput.value = meridiemInput.value;
});

//Create alarm div

const createAlarm = (alarmObj) => {
    //Keys from object
    const { id, alarmHour, alarmMinute, alarmSeconds,alarmMeridiem } = alarmObj;
    //Alarm div
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}: ${alarmSeconds} ${alarmMeridiem}</span>`;

    //checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        //console.log(e);
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);
    //Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);
};

//Set Alarm
setAlarm.addEventListener("click", () => {
    alarmIndex += 1;

    //alarmObject
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}_${secondsInput.value}_${meridiemInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.alarmSeconds = secondsInput.value;
    alarmObj.alarmMeridiem = meridiemInput.value;
    alarmObj.isActive = false;
    console.log(alarmObj);
    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
    secondsInput.value = appendZero(initialSeconds);
    meridiemInput.value = "";
});

//Start Alarm
const startAlarm = (e) => {
    //console.log(e);
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;
    }
};

//Stop alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
    }
};

//delete alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
};

window.onload = () => {
    setInterval(displayTimer);
    initialHour = 0;
    initialMinute = 0;
    initialSeconds = 0;
    alarmIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
    secondsInput.value = appendZero(initialSeconds);
    meridiemInput.value = "";
};

//https://clipchamp.com/watch/NGUEwrtBmso
//https://clipchamp.com/watch/NGUEwrtBmso

const today = new Date();

module.exports.getDate = function(){
    const options = {
        day: "numeric",
        year : "numeric",
        month:"long"
    }
    
    return today.toLocaleDateString("en-US", options)
};

module.exports.getDay = function(){
    let holiday = "";
    let currentDay = today.getDay();

    let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if(currentDay === 6 || currentDay === 0){
        holiday = "Weekend";
    }
    else{
        holiday = "Weekday";
    }
    let fullDate = weekDays[currentDay];
    return {fullDate, holiday};
};



var daysOfWeek = new Array("Mon", "Tues", "Wed", "Thur", "Fri");

daysOfWeek.push("Sat");
daysOfWeek.unshift("Sun");

// document.write(daysOfWeek + "<br/>");

// Create table
document.write("<table border=1>");
document.write("<tr>");

// Display days of the week
for (var i = 0; i < daysOfWeek.length; i++) {
    if (daysOfWeek[i].length < 4)
        day = daysOfWeek[i];
    else
        day = "<em>" + daysOfWeek[i] + "</em>";

    document.write("<th>" + day + "</th>");
}

document.write("</tr>");

// Display dates from 1 to 30
for (var date = 1; date <= 30; date++) {

    if ((date - 1) % 7 === 0) {
        document.write("<tr>");
    }

    document.write("<td>" + date + "</td>");

    if (date % 7 === 0 || date === 30) {
        document.write("</tr>");
    }
}

document.write("</table>");

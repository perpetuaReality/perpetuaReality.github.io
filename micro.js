setTimeout(function () { typewrite("subtitle", "<coding>"); }, 1800);
setTimeout(function () {
    var caret = document.getElementById("caret");
    caret.style.animationIterationCount = 0;
    caret.style.visibility = "hidden";
}, 8900);

async function typewrite(displayID, output) {
    var display = document.getElementById(displayID);
    var chars = output.split("");
    display.innerText = "";
    var pos = 0;
    var writeChar = setInterval(function () {
        if (pos >= chars.length) {
            clearInterval(writeChar);
            return;
        }
        display.innerText += chars[pos];
        pos++;
    }, 105 + Math.random() * 30)
}

var txtFile = new XMLHttpRequest();
txtFile.open("GET", "lang.xml", false);
txtFile.send(null);
var langs = txtFile.responseXML.firstElementChild.children;

var repo_names = ["Clipboard", "Scoreboard"];
repo_names.push("perpetuaReality.github.io"); //The website's repository.

if (self.fetch) {
    repo_names.forEach(function (repo) {
        fetch("https://api.github.com/repos/perpetuaReality/" + repo + "/languages")
            .then((res) => res.json())
            .then((data) => {
                //Get the by-language composition of the current repository, and store it into an array.
                var repo_langs = [];
                var lang_total = 0;
                for (var i = 0; i < langs.length; i++) {
                    var langAttr = langs.item(i).attributes;
                    if (data[langAttr.getNamedItem("name").value] != undefined) {
                        repo_langs.push({
                            name: langAttr.getNamedItem("name").value,
                            colour: langAttr.getNamedItem("colour").value,
                            amount: data[langAttr.getNamedItem("name").value]
                        })
                        lang_total += data[langAttr.getNamedItem("name").value];
                    }
                }
                //Sort the array in descending order of predominance.
                repo_langs.sort((a, b) => b.amount - a.amount);
                var repo_body = document.getElementById(repo.toLowerCase());
                repo_langs.forEach(function (repo_lang) {
                    //Create bars for each language
                    var lang_div = document.createElement("div");
                    var percent = (repo_lang.amount / lang_total) * 100;
                    lang_div.className = "lang_bar";
                    lang_div.style.backgroundColor = repo_lang.colour;
                    lang_div.style.width = percent + "%";
                    //Append the bar to the repository's language display
                    var isLast = (repo_langs.findIndex(function (val) { return val == repo_lang }) == repo_langs.length - 1);
                    if (repo == "perpetuaReality.github.io") {
                        document.getElementById("lang_details_site").appendChild(lang_div);
                        if (isLast) document.getElementById("lang_details_site").style.backgroundColor = repo_lang.colour;
                    } else {
                        repo_body.getElementsByClassName("lang_details")[0].appendChild(lang_div);
                        if (isLast) repo_body.getElementsByClassName("lang_details")[0].style.backgroundColor = repo_lang.colour;
                    }
                    //isLast helps solve some CSS weirdness where, in some screen sizes, it renders the language bar a little too little to cover the whole repository body div.

                    //Tooltip logic
                    lang_div.onmouseenter = function () { showTooltip(lang_div, repo_lang, percent) }
                    lang_div.onmouseout = function () { document.getElementById("lang_tooltip").style.visibility = "hidden" };
                })

            })
    })
} else {
    //Try something with XmlHttpRequest
}

function showTooltip(caller, langData, percent) {
    var minTop = 40;
    var minLeft = 100;
    var tooltip = document.getElementById("lang_tooltip");

    //Show the Tooltip.
    tooltip.style.visibility = "visible";

    var divPos = caller.getBoundingClientRect();
    //If the Tooltip has enough room above it, show it above the element that called it. Otherwise, show it below.
    if (divPos.top > minTop) {
        tooltip.style.top = (divPos.top - minTop) + "px";
    } else {
        tooltip.style.top = (divPos.top + divPos.height) + "px";
    }
    //If the Tooltip has enough room to the left and to the right, show it centered above/below the element that called it. Otherwise, move it around so that it fits.
    var divXCenterLeft = divPos.left + divPos.width / 2;
    var divXCenterRight = (window.innerWidth - divPos.right) + divPos.width / 2;
    if (divXCenterLeft < minLeft || divXCenterRight < minLeft) {
        if (divXCenterLeft < minLeft) {
            tooltip.style.left = divPos.left + "px";
        } else if (divXCenterRight < minLeft) {
            tooltip.style.left = (divPos.right - minLeft * 2) + "px";
        }
    } else {
        tooltip.style.left = (divPos.left + divPos.width / 2 - minLeft) + "px";
    }

    //Show the languages info on the tooltip;
    document.getElementById("lang_colourdot").style.backgroundColor = langData.colour;
    document.getElementById("lang_info").innerHTML = "<b>" + langData.name + "</b>: " + Math.round(percent * 100) / 100 + "%";
}
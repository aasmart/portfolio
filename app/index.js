function navBarIn() {
    const navBar = document.getElementsByTagName("nav").item(0);
    navBar.style.animation = "nav-bar-in 0.75s ease-in-out forwards";
    // Parse the elements in the unordered list into an array of text contents
    const navUl = navBar.children[0];
    const navBarElements = Array.from(navUl.children);
    const text = navBarElements.map((item) => item.textContent);
    // Grab the hrefs
    const href = Array.from(navBar.getElementsByTagName("a"))
        .map((item) => item.getAttribute("href"));
    // Clear text contents of nav bar items
    navBarElements.forEach((item) => { item.textContent = ""; });
    // Create the cursor
    const afterSpan = document.createElement("span");
    afterSpan.textContent = "|";
    afterSpan.style.whiteSpace = "break-spaces";
    navUl.after(afterSpan);
    // Handle the cursor's blinking
    let doTicker = true;
    let blinkingInterval = setInterval(() => {
        if (doTicker) {
            afterSpan.textContent = afterSpan.textContent === "|" ? " " : "|";
        }
    }, 200);
    // Variables for handling the exit of the typing animation
    const letterTimeouts = [];
    let skipTyping = false;
    // Magic text stuff
    navBar.addEventListener("animationend", (e) => {
        if (e.target.tagName !== "NAV")
            return;
        // Stop the cursor and set it back to its default state
        doTicker = false;
        afterSpan.textContent = "|";
        // Loop through each of the elements text contents and then write them back into the elements one character at a time
        const delay = 30;
        let totalDelay = 0;
        for (let i = 0; i < text.length; i++) {
            let element = navBarElements[i];
            if (element === undefined)
                continue;
            // Create the nav's anchor
            let anchor = element.appendChild(document.createElement("a"));
            if (href[i] !== null)
                anchor.href = href[i];
            // Loop through characters
            for (let c = 0; c < text[i]?.length; c++) {
                if (skipTyping)
                    return;
                // Span abuse to create the letters
                letterTimeouts.push(setTimeout(() => {
                    const span = document.createElement("span");
                    span.innerText = text[i].at(c);
                    anchor.appendChild(span);
                }, totalDelay));
                totalDelay += delay;
            }
        }
        // Manage the cursor blinking and stopping
        setTimeout(() => {
            sessionStorage.setItem("watchedIntro", "true");
            doTicker = true;
            // Remove the cursor
            setTimeout(() => {
                clearInterval(blinkingInterval);
                afterSpan.remove();
            }, 800);
        }, totalDelay);
    });
    // Allows the user to skip the typing animation
    let skipTypingEvent = () => {
        window.removeEventListener("keypress", skipTypingEvent);
        skipTyping = true; // Tell the loop that's handling the letter typing to return
        afterSpan.remove(); // Clear the cursor
        sessionStorage.setItem("watchedIntro", "true"); // So the user doesn't have to watch the animation more than once
        letterTimeouts.forEach((id) => clearTimeout(id)); // Get rid of the typing timeouts
        // Fill all the elements back up with their proper text
        for (let i = 0; i < navBarElements.length; i++) {
            navBarElements[i].innerHTML = '';
            let anchor = document.createElement("a");
            anchor.textContent = text[i];
            if (href[i] !== null)
                anchor.href = href[i];
            navBarElements[i].appendChild(anchor);
        }
    };
    window.addEventListener("keypress", skipTypingEvent);
}
window.onload = () => {
    const html = document.getElementsByTagName("html")[0];
    let closeIntro = document.getElementById("intro-close");
    let intro = closeIntro.parentElement;
    // Check if the user has already watched the animations
    if (sessionStorage.getItem("watchedIntro") !== "true") {
        sessionStorage.setItem("watchedIntro", "false");
        let closeIntroAnimation = () => {
            document.activeElement.blur();
            intro.style.animation = "fade-out .5s forwards";
            setTimeout(() => {
                const aboutMe = document.getElementById("about");
                aboutMe.style.opacity = "0";
                intro.parentElement.remove();
                html.style.overflowY = "auto";
                aboutMe.style.animation = "fade-in 0.5s ease-in-out forwards";
            }, 500);
        };
        let skipIntro = () => {
            closeIntro.removeEventListener("click", skipIntro);
            window.removeEventListener("keypress", skipIntro);
            closeIntroAnimation();
            navBarIn();
        };
        closeIntro.addEventListener("click", skipIntro);
        window.addEventListener("keypress", skipIntro);
    }
    else {
        // Skip all the animations
        html.style.overflowY = "auto";
        intro.parentElement.remove();
        const navBar = document.getElementsByTagName("nav").item(0);
        navBar.style.transform = "translateX(0%)";
        navBar.style.boxShadow = "0 4px 15px black";
    }
};
function highlightNavElement(index) {
    const navBar = document.getElementsByTagName("nav").item(0);
    const navUl = navBar.children[0];
    const navBarElements = Array.from(navUl.children);
    const element = navBarElements[index];
    if (element === undefined)
        return;
    element.focus();
}
//# sourceMappingURL=index.js.map
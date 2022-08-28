function navBarIn() {
    const navBar = document.getElementsByTagName("nav").item(0);
    navBar.style.animation = "nav-bar-in 0.75s ease-in-out forwards"

    const navUl = navBar.children[0];
    const navBarElements = Array.from(navUl.children);
    const text = navBarElements.map((item) => item.textContent);
    navBarElements.forEach((item) => { item.textContent = "" })

    // Create the cursor
    const afterSpan = document.createElement("span")
    afterSpan.textContent = "|"
    afterSpan.style.whiteSpace = "break-spaces"
    navUl.after(afterSpan)

    // Handle the cursor's blinking
    let doTicker = true;
    let blinkingInterval = setInterval(() => {
        if(doTicker) {
            afterSpan.textContent = afterSpan.textContent === "|" ? " " : "|";
        }
    }, 200);

    // Magic text stuff
    navBar.addEventListener("animationend", () => {
        // Stop the cursor and set it back to its default state
        doTicker = false;
        afterSpan.textContent = "|"

        // Loop through each of the elements text contents and then write them back into the elements one character at a time
        const delay = 30;
        let totalDelay = 0;
        for(let i = 0; i < text.length; i++) {
            for(let c = 0; c < text[i]?.length; c++) {
                let element = navBarElements[i]
                if(element === undefined)
                    continue;

                setTimeout(() => {element.textContent += text[i].at(c)}, totalDelay);
                totalDelay += delay;
            }
        }

        // Manage the cursor blinking and stopping
        setTimeout(() => {
            sessionStorage.setItem("watchedIntro", "true")
            doTicker = true
            // Remove the cursor
            setTimeout(() => {
                clearInterval(blinkingInterval);
                afterSpan.remove();
            }, 600)
        }, totalDelay);
    })
}

window.onload = () => {
    let closeIntro = document.getElementById("intro-close");
    let intro = closeIntro.parentElement;

    // Check if the user has already watched the animations
    if(sessionStorage.getItem("watchedIntro") !== "true") {
        sessionStorage.setItem("watchedIntro", "false");

        let closeIntroAnimation = () => {
            (document.activeElement as HTMLElement).blur()
            intro.style.animation = "fade-out .5s forwards";
            setTimeout(() => {
                intro.remove();
            }, 500)
            navBarIn();
        };

        closeIntro.addEventListener("click", () => {
            closeIntroAnimation();
        })

        let canPressKey = true;
        window.addEventListener("keypress", () => {
            if (canPressKey) {
                canPressKey = false
                closeIntroAnimation()
            }
        })
    } else {
        // Skip all the animations
        intro.remove();

        const navBar = document.getElementsByTagName("nav").item(0);
        navBar.style.transform = "translateX(0%)"
        navBar.style.boxShadow = "0 4px 15px black"
    }
}

function highlightNavElement(index: number) {
    const navBar = document.getElementsByTagName("nav").item(0);
    const navUl = navBar.children[0];
    const navBarElements = Array.from(navUl.children);

    const element = navBarElements[index] as HTMLElement;
    if(element === undefined)
        return;

    element.focus()
}
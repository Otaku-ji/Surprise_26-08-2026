/* =========================
   INSTALL PIN
========================= */

const INSTALL_PIN_HASH =
    "10f063388c65945cfa9d058ee5b738fdf1178fc919386883f6b9435a40931340";


let currentInstallPin = "";


const pinDots =
    document.querySelectorAll(
        "#installPinDots span"
    );


const pinMessage =
    document.getElementById(
        "installPinMessage"
    );


const deleteButton =
    document.getElementById(
        "installDeleteButton"
    );


const digitButtons =
    document.querySelectorAll(
        "[data-digit]"
    );


/* =========================
   HASH PIN
========================= */

async function hashInstallPin(
    pin
) {

    const encoder =
        new TextEncoder();


    const data =
        encoder.encode(
            pin
        );


    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );


    const hashArray =
        Array.from(
            new Uint8Array(
                hashBuffer
            )
        );


    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(
                        2,
                        "0"
                    )
        )
        .join("");

}


/* =========================
   UPDATE DOTS
========================= */

function updateInstallDots() {

    pinDots.forEach(
        (
            dot,
            index
        ) => {

            dot.classList.toggle(
                "filled",
                index <
                    currentInstallPin.length
            );

        }
    );

}


/* =========================
   MESSAGE
========================= */

function showInstallMessage(
    message
) {

    pinMessage.textContent =
        message;

}


/* =========================
   CHECK PIN
========================= */

async function checkInstallPin() {

    showInstallMessage(
        "Checking PIN..."
    );


    const enteredHash =
        await hashInstallPin(
            currentInstallPin
        );


    /* =========================
       CORRECT PIN
    ========================= */

    if (
        enteredHash ===
        INSTALL_PIN_HASH
    ) {

        /*
           Temporary session only.

           This is intentionally
           sessionStorage, NOT localStorage.
        */

        sessionStorage.setItem(
            "install_pin_authenticated",
            "true"
        );


        window.location.replace(
            "install.html"
        );


        return;

    }


    /* =========================
       WRONG PIN
    ========================= */

    showInstallMessage(
        "Incorrect PIN."
    );


    currentInstallPin = "";


    updateInstallDots();

}


/* =========================
   ADD DIGIT
========================= */

function addDigit(
    digit
) {

    if (
        currentInstallPin.length >= 8
    ) {

        return;

    }


    currentInstallPin +=
        digit;


    updateInstallDots();


    if (
        currentInstallPin.length === 8
    ) {

        checkInstallPin();

    }

}


/* =========================
   DELETE DIGIT
========================= */

function deleteDigit() {

    if (
        currentInstallPin.length === 0
    ) {

        return;

    }


    currentInstallPin =
        currentInstallPin.slice(
            0,
            -1
        );


    updateInstallDots();


    showInstallMessage(
        ""
    );

}


/* =========================
   BUTTON EVENTS
========================= */

digitButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                addDigit(
                    button.dataset.digit
                );

            }
        );

    }
);


deleteButton.addEventListener(
    "click",
    deleteDigit
);


/* =========================
   START
========================= */

updateInstallDots();
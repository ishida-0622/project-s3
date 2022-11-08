
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;

    })
}

const submitButton = document.querySelector("#submit")
if (submitButton) {
    const mail = (document.querySelector("#email") as HTMLInputElement).value
    const password = (document.querySelector("#password") as HTMLInputElement).value
    if (mail && password) {
        submitButton.addEventListener("click", () => login(mail, password))
    }
}

import PocketBase from "pocketbase"
import Swal from "sweetalert2";

export async function loginPocketBase(pb: PocketBase) {
  const w = window.open();
  await pb.collection('users').authWithOAuth2({
    provider: 'google',
    urlCallback: (url) => {
      if (!w) throw new Error("where window??")
      w.location.href = url;
    }
  });
}

export async function getAuthenticatedPocketBase() {
  const pb = new PocketBase('https://bbs-backend.noteqr.de');
  const looseCheckSucess = pb.authStore.model && pb.authStore.isValid
  try {
    if (!looseCheckSucess) throw new Error()
    if (!pb.authStore.model) throw new Error()
    await pb.collection("users").getOne(pb.authStore.model.id)
    console.log("success")
  } catch (e) {
    console.log("we want login")

    // await new Promise(r => setTimeout(r, 3000));
    await Swal.fire("Du wirst jetzt zum Login weitergeleitet")

    await loginPocketBase(pb)
  }

  return pb
}

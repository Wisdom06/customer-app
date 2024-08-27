import { redirect } from "react-router-dom";
import {deleteContact, deleteCustomer} from "../contact.js";

export async function action({ params }) {
    // throw new Error("oh dang!");
    await deleteCustomer(params.customerId);
    return redirect("/");
}
export default function Destroy(){
    return<>

    </>
}
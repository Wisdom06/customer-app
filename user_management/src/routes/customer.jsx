import { Form,useFetcher,useLoaderData, useParams, } from "react-router-dom";
import {getContact, getCustomer, updateContact, updateCustomer} from "../customers.js";
import {useEffect, useState} from "react";

export async function loader({params}) {
    const customer = await getCustomer(params.customerId);
    if (!customer) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    console.log(customer)
    return { customer };
}
// export async function action({ request, params }) {
//     const formData = await request.formData();
//     return updateContact  (params.customerId, {
//         favorite: formData.get("favorite") === "true",
//     });
// }

export default function Customer() {
    const params = useParams()
    console.log(params);

    const { customer } = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img
                    key={customer.profileImgData}
                    src={
                        customer.profileImgData ||
                        `https://robohash.org/${customer.id}.png?size=200x200`
                    }/>
            </div>

            <div>
                <h1>
                    {customer.firstname || customer.lastname ? (
                        <>
                            {customer.firstname} {customer.lastname}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    {/*<Favorite customer={customer} />*/}
                </h1>

                {customer.email && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${customer.email}`}
                        >
                            {customer.email}
                        </a>
                    </p>
                )}

                {customer.notes && <p>{customer.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ customer }) {
    const fetcher = useFetcher()
    const params = useParams()
    const trueOrfalse = false
    const [value,setValue] = useState(trueOrfalse)
    useEffect(() => {
        setValue(!trueOrfalse)
    }, [value]);
        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updateCustomer_ = new FormData()
            updateCustomer_.append('firstname', customer.firstname);
            updateCustomer_.append('lastname', customer.lastname);
            updateCustomer_.append('email', customer.email);
            updateCustomer_.append('note', customer.note);
            updateCustomer_.append('profileImg', customer.profileImg.data);
            updateCustomer_.append('favorite', customer.favorite);
            console.log(Array.from(updateCustomer_))
            // await updateCustomer(params.customerId, updateCustomer_)
        }

        const favorite = value
    console.log(favorite)
    // const favorite = fetcher.formData
    //     ? fetcher.formData.get("favorite") === "true"
    //     : customer.favorite;
    return (
        <fetcher.Form method="post" onSubmit={handleSubmit} encType={"multipart/form-data"}>
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}
import { Outlet,useLoaderData,Form,redirect, NavLink, useNavigation,useSubmit,} from "react-router-dom";
import {getContacts, createContact, getCustomers, createCustomer} from "../contact.js";
import { useEffect } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    console.log(url);

    const q = url.searchParams.get("q");
    const customers = await getCustomers(q);
    return { customers,q };
}

export async function action() {
    const customer = await createCustomer();
    return redirect(`/customers/${customer.id}/edit`);
}

export default function Root() {
    const { contact } = useLoaderData();
    const { customers,q } = useLoaderData();
    const submit = useSubmit();
    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);
    const navigation = useNavigation();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    return (
        <>
            <div id="sidebar">
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"

                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post" >
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {customers.length ? (
                        <ul>
                            {customers.map((customer) => (
                                <li key={customer.id}>
                                    <NavLink to={`customers/${customer.id}`}
                                             className={({ isActive, isPending }) =>
                                                 isActive
                                                     ? "active"
                                                     : isPending
                                                         ? "pending"
                                                         : ""
                                             }
                                    >
                                        {customer.firstname || customer.lastname ? (
                                            <>
                                                {customer.firstname} {customer.lastname}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {customer.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No customers</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail"
                 className={
                     navigation.state === "loading" ? "loading" : ""
                 }
            >
                <Outlet></Outlet>
            </div>
        </>
    );
}
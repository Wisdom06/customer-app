import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import axios from "axios";

const customerApi = axios.create({
    baseURL:'http://localhost:3000/customer/api'
})
export async function getCustomers(query){
    return await customerApi.get('/getCustomers').then(
        res=> res.data
    ).then(
        customers=> {
            // console.log(customers)
            if(query){
                customers = matchSorter(customers,query,{keys:['firstname','lastname']})
            }
            return customers.sort(sortBy("firstname", "createdAt"))
        }
    ).catch(err => console.error(err))
}

export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}
export async function createCustomer(){
    const defaultCustomer = {
        firstname:'firstname',
        lastname: 'lastname',
        email: 'email@gail.com',
        note:null,
        profileImg: null
    }
    const formData = new FormData();
    formData.append('firstname', defaultCustomer.firstname)
    formData.append('lastname', defaultCustomer.lastname)
    formData.append('email', defaultCustomer.email)
    formData.append('note', defaultCustomer.note)
    formData.append('profileImg', defaultCustomer.profileImg)
    return await customerApi.post('/createCustomer', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res.data).then(
        response =>{
            getCustomers()
            // console.log(response)
            return response
        }

    ).catch(err => console.log(err))
}
export async function createContact() {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
    let contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}
export async function getCustomer(id){
    return await customerApi.get(`/getCustomer/${id}`).then(
        res=> res.data
    ).then(
        customer=> {
            return customer
        }
    ).catch(err => console.error(err))
}
export async function getContact(id) {
    await fakeNetwork(`contact:${id}`);
    let contacts = await localforage.getItem("contacts");
    let contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
}
export async function updateCustomer(id, custumerUpdates) {
    let formData = new FormData();
    formData.append('firstname', custumerUpdates.get('firstname'));
    formData.append('lastname', custumerUpdates.get('lastname'));
    formData.append('email', custumerUpdates.get('email'));
    formData.append('note', custumerUpdates.get('note'));

    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
    };

    return await customerApi.put(`/updateCustomer/${id}`, custumerUpdates, config)
        .then(response => response.data)
        .then(customer => {
            console.log("Client mis à jour :", customer);

            return customer;
            getCustomers()
        })
        .catch(err => {
            console.error("Erreur lors de la mise à jour du client :", err);
        });
}

export async function deleteCustomer(id){
    await customerApi.delete(`/deleteCustomer/${id}`)
        .then(response => console.log('delete a customer'))
        .catch(err => console)
}
export async function deleteContact(id) {
    let contacts = await localforage.getItem("contacts");
    let index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}


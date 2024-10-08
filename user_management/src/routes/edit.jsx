import {Form, useLoaderData, redirect, useNavigate, useParams} from "react-router-dom";
import { updateCustomer} from "../customers.js";
import { Dropzone, FileMosaic } from "@files-ui/react";
import {useEffect, useRef, useState} from "react";

export async function action({ request, params }) {
    const formData = await request.formData();
    console.log(formData.get('firstname'))
    if (formData.get('profileImg')) {
        await updateCustomer(params.customerId, formData);
    }

    return redirect(`/customers/${params.customerId}`);
}

export default function EditContact() {
    const {customerId} = useParams()
    const { customer } = useLoaderData();
    const navigate = useNavigate();
    const [profileImage,setProfileImage] = useState(null)
    const fileInputRef = useRef(null)
    useEffect(() => {
        if (profileImage && fileInputRef.current) {
            // Mettre à jour l'input de fichier invisible avec l'image du Dropzone
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(profileImage);
            fileInputRef.current.files = dataTransfer.files;
        }
    }, [profileImage]);
    // async function handleSubmit(e) {
    //     // e.preventDefault();
    //     const formData = new FormData(e.target);
    //     console.log(formData.get('firstname'))
    //     if (profileImage) {
    //         // Ajouter le fichier d'image de profil sélectionné dans formData
    //         formData.append("profileImg", profileImage);
    //     }
    //     console.log(customer)
    //     await updateCustomer(customerId, formData);
    //     navigate(`/customers/${customerId}`);
    // }

    return (
        <Form method="put" id="contact-form" encType="multipart/form-data"
              // onSubmit={handleSubmit}

        >
            <p>
                <span>Name</span>
                <input
                    placeholder="Firstname"
                    aria-label="First name"
                    type="text"
                    name="firstname"
                    defaultValue={customer.firstname}
                />
                <input
                    placeholder="Lastname"
                    aria-label="Last name"
                    type="text"
                    name="lastname"
                    defaultValue={customer.lastname}
                />
            </p>
            <label>
                <span>Email</span>

            </label>
            <input
                type="text"
                name="email"
                placeholder="email@example.com"
                defaultValue={customer.email}
            />
            <label>
                <span>Profile image</span>

            </label>
            <FileInput setProfileImage={setProfileImage}/>
            <input
                ref={fileInputRef} // Référence pour lier à l'image du Dropzone
                type="file"
                name="profileImg"
                accept="image/*"
                style={{display: 'none'}} // Masquer l'input de fichier natif
            />
            <label>
                <span>Notes</span>
                <textarea
                    name="note"
                    defaultValue={customer.note}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => {
                    navigate(-1);
                }}>Cancel
                </button>
            </p>
        </Form>
    )
}

export function FileInput({setProfileImage}) {
    const [files, setFiles] = useState([]);

    const updateFiles = (incomingFiles) => {
        setFiles(incomingFiles);
        if (incomingFiles.length > 0) {
            // Mettre à jour l'image de profil avec le premier fichier sélectionné
            setProfileImage(incomingFiles[0].file);
        } else {
            setProfileImage(null);
        }
    };

    const removeFile = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    return (
        <Dropzone
            onChange={updateFiles}
            value={files}
            accept={"image/*"}
            maxFileSize={28 * 1024 * 1024}
            maxFiles={1}
            actionButtons={{ position: "bottom", uploadButton: {}, abortButton: {} }}
            fakeUpload
        >
            {files.map((file) => (
                <FileMosaic
                    key={file.id}
                    {...file}
                    onDelete={removeFile}
                    info
                    preview
                />
            ))}
        </Dropzone>
    );
}

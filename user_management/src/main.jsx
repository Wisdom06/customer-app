// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from './error-page.jsx';
import Root, { loader as rootLoader,action as rootAction, } from "./routes/root";
import Customer,{ loader as customerLoader,/*action as contactAction,*/ } from './routes/customer.jsx';
import EditContact ,{action as editAction,} from "./routes/edit";
import Destroy, {action as destroyAction} from './routes/destroy.jsx';
import Index from "./routes/index";

const router = createBrowserRouter([
    {
        path:'/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        loader: rootLoader,
        action: rootAction,
        children:[{
            errorElement: <ErrorPage />,
            children:[{
                index :true,
                element:<Index/>
            },
                {

                    path:'customers/:customerId',
                    element:<Customer/>,
                    loader: customerLoader,
                    // action: contactAction,
                },
                {
                    path: "customers/:customerId/edit",
                    element: <EditContact />,
                    loader: customerLoader,
                    action: editAction
                },
                {
                    path: "customers/:customerId/destroy",
                    element: <Destroy />,
                    errorElement:<div>An error has occured</div>,
                    action: destroyAction,

                }
                ,
            ]
        }]

    },
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router}/>
  // </StrictMode>,
)

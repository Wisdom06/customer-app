const Customer = require('../config/db_config')
const FileType = require('file-type');
const express = require('express')
const {check,validationResult, body} = require('express-validator')
const multer = require('multer')
const router = express.Router()


const upload = multer()
router.get('/getCustomers', async (req, res) => {
    try {
        const customers = await Customer.findAll()
        res.json(customers)
    }
    catch (err) {

    }
})
router.get('/getCustomer/:customerId', async (req, res) => {
    try{
        const {customerId} = req.params
        await Customer.findByPk(customerId).then(async customer => {
            if (customer) {
                let mimeType = 'application/octet-stream'; // Valeur par défaut pour un type inconnu
                if (customer.profileImg) {
                    const type = await FileType.fromBuffer(customer.profileImg);
                    mimeType = type ? type.mime : mimeType;
                }
                const profileImgData = customer.profileImg
                    ? `data:${mimeType};base64,${customer.profileImg.toString('base64')}`
                    : null;
                const customer_ = {
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    email: customer.email,
                    profileImgData: profileImgData,
                    profileImg: customer.profileImg,
                    note: customer.note,
                    favorite: customer.favorite
                }
                return res.json(customer_)
            } else {
                res.status(400).send('Utilisateur non trouvé');
            }
        })
    }
    catch (e) {
        console.error(e.message)
    }
})
router.post('/createCustomer',upload.single('profileImg'),
    [
        body('firstname').trim()
            .notEmpty()
            .withMessage('firstname is required'),
        body('lastname').trim()
            .notEmpty()
            .withMessage('lastname is required'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('email is required')
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const customer = req.body
        const profileImg = req.file ? req.file.buffer : null
        const newCustomer = await Customer.build({
            firstname:customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
            note:customer.note,
            profileImg: profileImg
        })
        await newCustomer.save().then(() => res.json(newCustomer)).catch((err) => console.log(err.message))
    }catch (err) {
        console.log(err.message)
    }
})
router.put('/updateCustomer/:id',upload.single('profileImg'),
    [
        body('firstname').trim()
            .notEmpty()
            .withMessage('firstname is required'),
        body('lastname').trim()
            .notEmpty()
            .withMessage('lastname is required'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('email is required')
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {id} = req.params
        console.log(id)
        const updatedCustomer = req.body
        const updatedProfileImg = req.file? req.file.buffer : null
        await Customer.findByPk(id).then(user=>{
            if(user){
                user.firstname = updatedCustomer.firstname
                user.lastname = updatedCustomer.lastname
                user.email = updatedCustomer.email
                user.note = updatedCustomer.note
                user.profileImg = updatedProfileImg
                user.save().then(() => res.json(user)).catch(() => res.send('request failed'))
            }
            else {
                res.status(400).send('Utilisateur non trouvé');
            }
        })
    }
    catch (e) {
        console.error(e.message)
    }
})
router.delete('/deleteCustomer/:id', async (req, res) => {
        try{
            const {id} = req.params
            await Customer.findByPk(id).then(user=>{
                if(user){
                    user.destroy().then(() => res.send(`User deleted ${JSON.stringify(user)}`)).catch(() => res.send('request failed'))
                }
                else {
                    res.status(400).send('Utilisateur non trouvé');
                }
            })
        }
        catch (e) {
            console.error(e.message)
        }
    })

module.exports = router

const {Router} = require('express')
const landmet = require('../models/landmets')
const router = Router()

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/landmet', async (req,res) => {
    const landmets = await landmet.find({recclass: 'H', name: 'Abo'}).lean()
    console.log(landmets)
    res.render('landmet', {
        landmets
    })
})

router.get('/NEO', async (req,res) => {
  res.render('NEO')
})

router.get('/MKS', async (req,res) => {
    res.render('MKS')
})

module.exports = router
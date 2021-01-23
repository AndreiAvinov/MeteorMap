const {Router} = require('express')
const landmet = require('../models/landmets')
const router = Router()
const http = require('http');
const url = require('url');

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/landmet', async (req,res) => {
	// use .skip(num) to skip num documents
    const landmets = await landmet.find({}).limit(50).lean()
    // console.log(landmets[0])
    res.render('landmet', {
        landmets
    })
})

//returns query results
router.get('/service/query', async (req,res) => {
	const queryObject = url.parse(req.url,true).query;
	if (queryObject.len){
		const len = await landmet.find({recclass: queryObject.recclass}).count()
		res.jsonp({len : len})
	}
	console.log(queryObject.recclass)
    const landmets = await landmet.find(queryObject).lean()
    console.log(landmets[0])
    res.jsonp(landmets)
})

//returns query result count
router.get('/service/query_len',  async (req,res) => {
	const queryObject = url.parse(req.url,true).query;
    const len = await landmet.find({recclass: queryObject.recclass}).count()
    console.log(len)
    res.jsonp({len : len})
})


router.get('/NEO', async (req,res) => {
  res.render('NEO')
})

router.get('/MKS', async (req,res) => {
    res.render('MKS')
})

module.exports = router
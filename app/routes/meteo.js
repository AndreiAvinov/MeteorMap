const {Router} = require('express')
const landmet = require('../models/landmets')
const router = Router()
const http = require('http');
const url = require('url');

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/landmet', async (req,res) => {
    res.render('landmet')
})

//returns query results
router.get('/service/query', async (req,res) => {
	const queryObject = url.parse(req.url,true).query;
	var queryFilter = {}
	console.log(queryObject)
	if (!queryObject.recclass){delete queryObject.recclass;}
	else{
		queryFilter.recclass = queryObject.recclass
	}
	if (!queryObject.fromYear){delete queryObject.fromYear;}
	else{
		if (typeof queryFilter.year == 'undefined') {queryFilter.year = {};}
		queryFilter.year['$gte'] = parseInt(queryObject.fromYear)
	}
	if (!queryObject.toYear){delete queryObject.toYear;}
	else{
		if (typeof queryFilter.year == 'undefined') {queryFilter.year = {};}
		queryFilter.year['$lte'] = parseInt(queryObject.toYear)
	}
	if (!queryObject.fromMass){delete queryObject.fromMass;}
	else{
		if (typeof queryFilter.mass == 'undefined') {queryFilter.mass = {};}
		queryFilter.mass['$gte'] = parseInt(queryObject.fromMass)
	}
	if (!queryObject.toMass){delete queryObject.toMass;}
	else{
		if (typeof queryFilter.mass == 'undefined') {queryFilter.mass = {};}
		queryFilter.mass['$lte'] = parseInt(queryObject.toMass)
	}
	console.log(queryFilter)
	if (queryObject.len){
		const len = await landmet.find(queryFilter).count()
		res.jsonp({len : len})
	}
	console.log(queryObject)
    const landmets = await landmet.find(queryFilter).lean()
    console.log(landmets[0])
    res.jsonp(landmets)
})

//returns query results count
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
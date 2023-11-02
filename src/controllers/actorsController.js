const db = require('../database/models');
const sequelize = db.sequelize;


const actorsController = {
    list: (req, res) => {
        db.Actor.findAll({
            order:[ ['first_name'],
                    ['last_name']]
        })
            .then(actors => {
                res.render('actorsList.ejs', {actors})
            })
    },
    detail: (req, res) => {
        db.Actor.findByPk(req.params.id,{
            include :['movies','favorite']
        })
            .then(actor => {
                res.render('actorsDetail.ejs', {
                    actor
                });
            });
    },
    add: function (req, res) {
        const movies =db.Movie.findAll({
            order : ['title']
        })
        const actors = db.Actor.findAll({
            order:[
                ['first_name'],
                ['last_name']
            ]
        })

        Promise.all([movies, actors])
         .then(([movies, actors]) =>{
            return res.render('actorsAdd',{
                movies,
                actors
            })
        })
        .catch(error=>console.log(error))
    },

}

module.exports = actorsController;
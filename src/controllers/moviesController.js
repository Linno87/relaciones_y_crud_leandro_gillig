const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { error } = require('console');

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');




const moviesController = {
    list: (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
        })
            .then(movies => {
              return   res.render('moviesList', {movies})
            })
            .catch(error=>console.log(error))
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include: ['genre','actors'],
        })
            .then(movie => {
               return res.render('moviesDetail', {movie});
            })
            .catch(error=>console.log(error))
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    
    add: function (req, res) {
        const genres =db.Genre.findAll({
            order : ['name']
        })
        const actors = db.Actor.findAll({
            order:[
                ['first_name'],
                ['last_name']
            ]
        })

        Promise.all([genres, actors])
         .then(([genres, actors]) =>{
            return res.render('moviesAdd',{
                allGenres: genres,
                actors
            })
        })
        .catch(error=>console.log(error))
    },
    create: function (req, res) {
        let {title, rating, awards, release_date, length, genre_id, actors} = req.body;

        actors = typeof actors === 'string' ? [actors] : actors

        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id
        })
        .then(movie=>{

            if(actors){
                const actorsDB = actors.map(actor=>{
                    return {
                        movie_id: movie.id,
                        actor_id: actor
                    }
                })
                db.Actor_Movie.bulkCreate(actorsDB,{
                    validate: true
                })
                .then((response)=>{
                    console.log(response);
                })
            }
            return res.redirect('/movies/detail/' + movie.id)
        })
        .catch(error => console.log(error))
    },
    edit: function(req, res) {
        const allGenres = db.Genre.findAll({
            order : ['name']
        })
        
        const movie = db.Movie.findByPk(req.params.id,{
            include : ['actors']
        })

        const actors = db.Actor.findAll({
            order:[
                ['first_name'],
                ['last_name']
            ]
        })

        Promise.all([movie, allGenres, actors])
        .then(([movie, allGenres, actors]) =>{
            return res.render('moviesEdit',{
                Movie: movie,
                allGenres,
                moment,
                actors
            })
        })
        .catch(error => console.log(error))
    },
    update: function (req,res) {
        let {title, rating, awards, release_date, length, genre_id, actors} = req.body;

        actors = typeof actors === 'string' ? [actors] : actors

        

        db.Movie.update({
            title: title,
            rating,
            awards,
            release_date,
            length,
            genre_id
        },
        {
            where:{
                id : req.params.id
            }
        })
       .then(response =>{
            console.log(response)
            db.Actor_Movie.destroy({
                where : {
                    movie_id : req.params.id
                }
            })
            .then(()=>{
                if(actors){
                    const actorsDB = actors.map(actor=>{
                        return {
                            movie_id: req.params.id,
                            actor_id: actor
                        }
                    })
                    db.Actor_Movie.bulkCreate(actorsDB,{
                        validate: true
                    })
                    .then((response)=>{
                        console.log(response);
                    })
                }
                })
       })
       .catch(error => console.log(error))
       .finally(()=>res.redirect('/movies/detail/' + req.params.id))
    },
    destroy: function (req, res) {
        db.Actor_Movie.destroy({
            where: {
                movie_id: req.params.id 
            }
        })
            .then((response)=>{
            console.log(response)
            
                db.Actor.update({
                    favorite_movie_id: null
                },{
                    where: {
                        favorite_movie_id : req.params.id
                    }
                }).then((response)=>{
                    console.log(response)
                    db.Movie.destroy({ where: {
                        id: req.params.id
                    }})
                    .then(()=>{
                        return res.redirect('/movies');
                    })
                })

           
        })
        .catch(error => console.log(error))
    }

}

module.exports = moviesController;
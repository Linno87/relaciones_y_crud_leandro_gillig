const db = require("../database/models");
const sequelize = db.sequelize;

const actorsController = {
  list: (req, res) => {
    db.Actor.findAll({
      order: [["first_name"], ["last_name"]],
    }).then((actors) => {
      res.render("actorsList.ejs", { actors });
    });
  },
  detail: (req, res) => {
    db.Actor.findByPk(req.params.id, {
      include: ["movies", "favorite"],
    }).then((actor) => {
      res.render("actorsDetail.ejs", {
        actor,
      });
    });
  },
  add: function (req, res) {
    const movies = db.Movie.findAll({
      order: ["title"],
    });
    const actors = db.Actor.findAll({
      order: [["first_name"], ["last_name"]],
    });

    Promise.all([movies, actors])
      .then(([movies, actors]) => {
        return res.render("actorsAdd", {
          movies,
          actors,
        });
      })
      .catch((error) => console.log(error));
  },
  create: function (req, res) {
    let { first_name, last_name, rating, favorite_movie_id, movies } = req.body;
    movies = typeof movies === "string" ? [movies] : movies;
    db.Actor.create({
      first_name,
      last_name,
      rating,
      favorite_movie_id,
    })
      .then((actor) => {
        if (movies) {
          const moviesDB = movies.map((movie) => {
            return {
              movie_id: movie,
              actor_id: actor.id,
            };
          });
          db.Actor_Movie.bulkCreate(moviesDB, {
            validate: true,
          }).then((response) => {
            console.log(response);
          });
        }
        return res.redirect("/actors/detail/" + actor.id);
      })
      .catch((error) => console.log(error));
  },
  edit: function (req, res) {
    const actors = db.Actor.findByPk(req.params.id, {
      include: ["movies"],
    });

    const movies = db.Movie.findAll();

    Promise.all([actors, movies])
      .then(([actors, movies]) => {
        return res.render("actorsEdit", {
          actors,
          movies,
        });
      })
      .catch((error) => console.log(error));
  },
  update: function (req, res) {

    let { first_name, last_name, rating, favorite_movie_id, movies } = req.body;
    movies = typeof movies === "string" ? [movies] : movies;
    db.Actor.update(
      {
        first_name,
        last_name,
        rating,
        favorite_movie_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((response) => {
        console.log(response);
        db.Actor_Movie.destroy({
          where: {
            actor_id: req.params.id,
          },
        }).then(() => {
          if (movies) {
            const moviesDB = movies.map((movie) => {
              return {
                movie_id: movie,
                actor_id: actor.id,
              };
            });

            db.Actor_Movie.bulkCreate(moviesDB, {
              validate: true,
            }).then((response) => {
              console.log(response);
            });
          }
        });
      })
      .catch((error) => console.log(error))
      .finally(() => res.redirect("/actors/detail/" + req.params.id));
  },
  destroy: function (req, res) {
    db.Actor_Movie.destroy({
      where: {
        actor_id: req.params.id,
      },
    })
      .then((response) => {
        console.log(response);

        db.Actor.destroy({
          where: {
            id: req.params.id,
          },
        }).then(() => {
          return res.redirect("/actors");
        });
      })

      .catch((error) => console.log(error));
  },
};
module.exports = actorsController;

package handlers

import (
	"be/internal/helpers"
	"be/internal/repositories"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"net/http"
)

type Handler struct {
	*chi.Mux

	repository *repositories.Repository
}

func NewHandler(repository *repositories.Repository) *Handler {
	h := &Handler{
		Mux:        chi.NewMux(),
		repository: repository,
	}

	sessions := SessionHandler{repository: repository}
	users := UserHandler{repository: repository}
	subreddits := SubredditHandler{repository: repository}
	posts := PostHandler{repository: repository}
	votes := VoteHandler{repository: repository}
	comments := CommentHandler{repository: repository}

	h.Use(middleware.Logger)
	h.Use(middleware.Recoverer)
	h.Use(middleware.AllowContentType("application/json"))

	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowCredentials: true,
	})

	h.Use(corsOptions.Handler)

	h.Route("/api", func(r chi.Router) {
		h.Post("/register", func(w http.ResponseWriter, r *http.Request) {
			sessions.Register(w, r)
		})

		h.Post("/login", func(w http.ResponseWriter, r *http.Request) {
			sessions.Login(w, r)
		})

		h.Post("/logout", func(w http.ResponseWriter, r *http.Request) {
			sessions.Logout(w, r)
		})

		h.Post("/refresh-token", func(w http.ResponseWriter, r *http.Request) {
			sessions.RefreshToken(w, r)
		})

		h.Route("/users", func(r chi.Router) {
			h.Post("/follow/{username}", func(w http.ResponseWriter, r *http.Request) {
				users.FollowUser(w, r)
			})

			h.Post("/unfollow/{username}", func(w http.ResponseWriter, r *http.Request) {
				users.UnfollowUser(w, r)
			})
		})

		h.Route("/subreddits", func(r chi.Router) {
			h.Post("/", func(w http.ResponseWriter, r *http.Request) {
				subreddits.CreateSubreddit(w, r)
			})

			h.Post("/join/{subredditName}", func(w http.ResponseWriter, r *http.Request) {
				subreddits.JoinSubreddit(w, r)
			})

			h.Post("/leave/{subredditName}", func(w http.ResponseWriter, r *http.Request) {
				subreddits.LeaveSubreddit(w, r)
			})

			h.Route("/{subredditName}", func(r chi.Router) {
				h.Get("/", func(w http.ResponseWriter, r *http.Request) {
					subreddits.GetSubreddit(w, r)
				})
				h.Delete("/", func(w http.ResponseWriter, r *http.Request) {
					subreddits.DeleteSubreddit(w, r)
				})
			})
		})

		h.Route("/posts", func(r chi.Router) {
			h.Post("/", func(w http.ResponseWriter, r *http.Request) {
				posts.CreatePost(w, r)
			})

			h.Route("/{id}", func(r chi.Router) {
				h.Get("/", func(w http.ResponseWriter, r *http.Request) {
					posts.GetPost(w, r)
				})

				h.Post("/vote", func(w http.ResponseWriter, r *http.Request) {
					votes.VotePost(w, r)
				})

				h.Delete("/vote", func(w http.ResponseWriter, r *http.Request) {
					votes.DeleteVotePost(w, r)
				})

				h.Delete("/", func(w http.ResponseWriter, r *http.Request) {
					posts.DeletePost(w, r)
				})
			})
		})

		h.Route("/comments", func(r chi.Router) {
			h.Post("/", func(w http.ResponseWriter, r *http.Request) {
				comments.CreateComment(w, r)
			})

			h.Route("/{id}", func(r chi.Router) {
				h.Post("/vote", func(w http.ResponseWriter, r *http.Request) {
					votes.VoteComment(w, r)
				})

				h.Delete("/vote", func(w http.ResponseWriter, r *http.Request) {
					votes.DeleteVoteComment(w, r)
				})

				h.Delete("/", func(w http.ResponseWriter, r *http.Request) {
					comments.DeleteComment(w, r)
				})
			})
		})
	})

	// Protected routes
	h.Group(func(r chi.Router) {
		h.Use(helpers.JWTAuthMiddleware)
		h.Get("/api/profile", func(w http.ResponseWriter, r *http.Request) {
			users.GetActiveUser(w, r)
		})
	})

	return h
}

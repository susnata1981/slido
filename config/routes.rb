Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  devise_scope :user do
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :v1, defaults: { format: 'json' } do
    get 'things', to: 'things#index'
    # get 'events', to: 'events#index'
    # get 'events/:id', to: 'events#get'
    # post 'events/create', to: 'events#create'

    resources :events do
      resources :questions
    end

    post 'events/join', to: 'events#join'
    get 'guest/:id', to: 'guest#get'
    # get 'guest/isUserLoggedIn', to: 'guest#isGuestUserLoggedIn'
    # post 'questions/create', to: 'questions#create'
    # get 'questions/:event_id', to: 'questions#get'
    post 'questions/:id/vote', to: 'questions#vote'
    post 'questions/:id/update_status', to: 'questions#update_status'
    # post 'questions/:id/down', to: 'questions#down'
  end

  get 'admin', to: 'admin#index'
  get 'logged_in', to: 'admin#is_logged_in?'
  get 'is_logged_in_as_guest', to: 'admin#is_logged_in_as_guest?'

  get '*page', to:'static#index', constraint: -> (req) do
    !req.xhr? && req.format.html?
  end

  root 'static#index'
  # root 'events/join'
end

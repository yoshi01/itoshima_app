Rails.application.routes.draw do
  get 'map' => 'map#index'

  devise_for :users, only: [:session]
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end
  namespace :admin do
    resources :tourist_spots
    resources :courses
    resources :course_relationships
    root to: "tourist_spots#index"
  end

  resources :tourist_spots
  root 'tourist_spots#index'
end


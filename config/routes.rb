Rails.application.routes.draw do
  get 'map/index'

  devise_for :users, only: [:session]
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end
  namespace :admin do
    resources :tourist_spots
    root to: "tourist_spots#index"
  end

  resources :tourist_spots
  root 'tourist_spots#index'
end


Rails.application.routes.draw do
  resources :tourist_spots
  root 'tourist_spots#index'
end

Rails.application.routes.draw do
  resources :tourist_spots
  root 'application#hello'
end

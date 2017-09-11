json.extract! tourist_spot, :id, :name, :description, :location, :created_at, :updated_at
json.url tourist_spot_url(tourist_spot, format: :json)

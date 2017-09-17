class AddLatLongToTouristSpots < ActiveRecord::Migration[5.1]
  def change
    add_column :tourist_spots, :latitude, :float
    add_column :tourist_spots, :longitude, :float
  end
end
